import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const SchemeContext = createContext();

export const SchemeProvider = ({ children }) => {
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPhoneSearchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const storedPhoneNumber = await AsyncStorage.getItem('userPhoneNumber');

      if (!storedPhoneNumber) {
        throw new Error('No phone number found in storage');
      }

      console.log('Fetching data for phone:', storedPhoneNumber);

      const phoneResponse = await fetch(
        `https://akj.brightechsoftware.com/v1/api/account/phonesearch?phoneNo=${storedPhoneNumber}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );

      if (!phoneResponse.ok) {
        throw new Error(`Phone Search failed with status: ${phoneResponse.status}`);
      }

      const phoneJson = await phoneResponse.json();
      console.log('Phone search response:', JSON.stringify(phoneJson, null, 2));

      if (!phoneJson || phoneJson.length === 0) {
        throw new Error('No accounts found for this phone number');
      }

      const productPromises = phoneJson.map(async (item, index) => {
        if (!item.regno || !item.groupcode) {
          console.warn(`Skipping item ${index} - missing regno or groupcode:`, item);
          return null;
        }

        try {
          // Fetch account details
          const accountRes = await fetch(
            `https://akj.brightechsoftware.com/v1/api/account?regno=${item.regno}&groupcode=${item.groupcode}`,
            {
              method: 'GET',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
            }
          );

          // Fetch amount/weight details
          const weightRes = await fetch(
            `https://akj.brightechsoftware.com/v1/api/getAmountWeight?REGNO=${item.regno}&GROUPCODE=${item.groupcode}`,
            {
              method: 'GET',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
            }
          );

          if (!accountRes.ok) {
            console.warn(`Account API failed for ${item.regno}-${item.groupcode}:`, accountRes.status);
            return null;
          }

          if (!weightRes.ok) {
            console.warn(`Weight API failed for ${item.regno}-${item.groupcode}:`, weightRes.status);
            return null;
          }

          const accountData = await accountRes.json();
          const weightData = await weightRes.json();

          console.log(`Account data for ${item.regno}-${item.groupcode}:`, JSON.stringify(accountData, null, 2));
          console.log(`Weight data for ${item.regno}-${item.groupcode}:`, JSON.stringify(weightData, null, 2));

          // Normalize maturity date
          let maturityDate = item.maturitydate || item.maturityDate || accountData?.schemeSummary?.maturityDate;
          console.log(`Raw maturity date for ${item.regno}-${item.groupcode}:`, maturityDate);

          if (maturityDate) {
            try {
              let parsedDate;
              if (typeof maturityDate === 'string') {
                if (maturityDate.includes('-') && maturityDate.split('-').length === 3) {
                  const [part1, part2, part3] = maturityDate.split('-');
                  // Try DD-MM-YYYY
                  parsedDate = new Date(`${part3}-${part2}-${part1}`);
                  if (isNaN(parsedDate.getTime())) {
                    // Try YYYY-MM-DD
                    parsedDate = new Date(maturityDate);
                  }
                } else if (maturityDate.includes('/')) {
                  const [part1, part2, part3] = maturityDate.split('/');
                  // Try DD/MM/YYYY
                  parsedDate = new Date(`${part3}-${part2}-${part1}`);
                } else {
                  parsedDate = new Date(maturityDate);
                }
              } else {
                parsedDate = new Date(maturityDate);
              }

              if (isNaN(parsedDate.getTime())) {
                console.warn(`Invalid maturity date for ${item.regno}-${item.groupcode}:`, maturityDate);
                maturityDate = null;
              } else {
                maturityDate = parsedDate.toISOString();
              }
            } catch (err) {
              console.warn(`Error parsing maturity date for ${item.regno}-${item.groupcode}:`, err.message);
              maturityDate = null;
            }
          } else {
            console.log(`No maturity date found for ${item.regno}-${item.groupcode}`);
            maturityDate = null;
          }

          // Determine status
          const isActive = !maturityDate || new Date(maturityDate) > new Date();
          const status = isActive ? 'Active' : 'Deactive';

          // Calculate progress percentage
          const totalInstallments = accountData?.schemeSummary?.instalment || 0;
          const paidInstallments = accountData?.schemeSummary?.schemaSummaryTransBalance?.insPaid || 0;
          const progressPercentage = totalInstallments > 0 ? (paidInstallments / totalInstallments) * 100 : 0;

          return {
            ...item,
            amountWeight: Array.isArray(weightData) ? weightData[0] : weightData,
            accountDetails: accountData,
            status,
            progressPercentage: Math.round(progressPercentage),
            schemeName: accountData?.schemeSummary?.schemeName || 'Unknown Scheme',
            totalAmount: weightData?.[0]?.Amount || weightData?.Amount || 0,
            savedWeight: weightData?.[0]?.Weight || weightData?.Weight || 0,
            maturityDate,
          };
        } catch (err) {
          console.error(`Error processing item ${item.regno}-${item.groupcode}:`, err);
          return null;
        }
      });

      const resolvedData = await Promise.all(productPromises);
      const validProducts = resolvedData.filter((item) => item !== null && item.amountWeight);

      console.log('Final processed data:', JSON.stringify(validProducts, null, 2));

      if (validProducts.length === 0) {
        throw new Error('No valid scheme data found');
      }

      setProductData(validProducts);
      setError(null);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
      setProductData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhoneSearchData();
  }, []);

  const value = {
    productData,
    loading,
    error,
    refetch: fetchPhoneSearchData,
    getActiveSchemes: () => productData.filter(item => item.status === 'Active'),
    getInactiveSchemes: () => productData.filter(item => item.status === 'Deactive'),
    getTotalAmount: () => productData.reduce((sum, item) => sum + (item.totalAmount || 0), 0),
  };

  return (
    <SchemeContext.Provider value={value}>
      {children}
    </SchemeContext.Provider>
  );
};