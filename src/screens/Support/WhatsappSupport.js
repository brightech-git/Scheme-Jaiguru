import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Linking
} from 'react-native';

const WhatsAppSupport = ({ navigation }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Hello! Welcome to Digi Gold Support. I\'m your virtual assistant. How can I help you with gold investments today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isUser: false,
      type: 'greeting'
    },
  ]);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef(null);

  // Knowledge base for the chatbot
  const knowledgeBase = {
    greetings: [
      'Hello! How can I assist you with your Digi Gold investments today?',
      'Hi there! Welcome to Digi Gold support. What can I help you with?',
      'Greetings! I\'m here to help with all your gold investment queries.'
    ],
    buying: [
      'To buy gold, go to the "Buy Gold" section, choose the amount, and complete the payment. Minimum purchase is 0.1 gram.',
      'You can buy gold starting from just 0.1 gram. Navigate to the Buy section and follow the simple steps.',
      'Gold purchase is easy! Select your desired quantity and payment method. We support UPI, cards, and net banking.'
    ],
    selling: [
      'Sell your gold anytime from the "Sell Gold" section. The amount will be credited to your bank account within 24 hours.',
      'To sell, go to your gold holdings, select the quantity, and confirm. We offer instant redemption at market rates.',
      'Selling is quick! Choose the gold you want to sell and get the current market value instantly.'
    ],
    charges: [
      'We charge 1% making charges on gold purchases. There are no storage fees for the first year.',
      'Making charges are 1% of the gold value. Storage is free for 12 months, then 0.5% annually.',
      'Our fees include 1% making charges. Enjoy free storage for one year!'
    ],
    safety: [
      'Your gold is 100% secure! We store it in RBI-approved vaults with insurance coverage.',
      'All gold is stored in secure vaults with 24/7 monitoring and full insurance protection.',
      'Security is our priority. Your gold is insured and stored in government-approved facilities.'
    ],
    delivery: [
      'You can take physical delivery of your gold anytime. Minimum 10 grams for delivery with nominal charges.',
      'Physical delivery available for orders above 10 grams. Delivery charges apply based on location.',
      'Get your gold delivered! Minimum 10 grams required. We offer secure delivery across India.'
    ],
    default: [
      'I understand you\'re asking about: "{query}". For detailed assistance, our human support team can help you better.',
      'That\'s an interesting question about "{query}". Let me connect you with our specialist for more details.',
      'Regarding "{query}", I recommend speaking with our support executive for personalized assistance.'
    ]
  };

  // Function to analyze user message and generate appropriate response
  const generateBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    let responseType = 'default';
    let query = userMessage;

    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      responseType = 'greetings';
    } else if (message.includes('buy') || message.includes('purchase') || message.includes('invest')) {
      responseType = 'buying';
    } else if (message.includes('sell') || message.includes('redeem') || message.includes('withdraw')) {
      responseType = 'selling';
    } else if (message.includes('charg') || message.includes('fee') || message.includes('cost')) {
      responseType = 'charges';
    } else if (message.includes('safe') || message.includes('secure') || message.includes('insurance')) {
      responseType = 'safety';
    } else if (message.includes('deliver') || message.includes('physical') || message.includes('ship')) {
      responseType = 'delivery';
    }

    const responses = knowledgeBase[responseType];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    return responseType === 'default' 
      ? randomResponse.replace('{query}', query)
      : randomResponse;
  };

  const sendMessage = () => {
    if (message.trim() === '') return;

    const userMessage = {
      id: Date.now(),
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isUser: true,
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: generateBotResponse(message),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isUser: false,
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);

      // Auto-suggest next steps for complex queries
      if (message.length > 20) {
        setTimeout(() => {
          const suggestion = {
            id: Date.now() + 2,
            text: 'Would you like me to connect you with a human support executive for more detailed assistance?',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isUser: false,
            isSuggestion: true
          };
          setMessages(prev => [...prev, suggestion]);
        }, 1000);
      }
    }, 1500 + Math.random() * 1000); // Random delay between 1.5-2.5 seconds
  };

  const handleSuggestionResponse = (response) => {
    if (response === 'yes') {
      const userMessage = {
        id: Date.now(),
        text: 'Yes, please connect me with human support',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isUser: true,
      };
      setMessages(prev => [...prev, userMessage]);

      setTimeout(() => {
        const botResponse = {
          id: Date.now() + 1,
          text: 'Perfect! I\'m connecting you with our support executive. They will join this chat shortly.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isUser: false,
        };
        setMessages(prev => [...prev, botResponse]);
      }, 1000);
    }
  };

  const openRealWhatsApp = () => {
    const phoneNumber = '+1234567890'; // Replace with your support number
    const welcomeMessage = 'Hello Digi Gold Support, I need assistance with:';
    
    Linking.openURL(`whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(welcomeMessage)}`)
      .catch(() => {
        Alert.alert('Error', 'WhatsApp is not installed on your device');
      });
  };

  const quickReplies = [
    'How to buy gold?',
    'What are the charges?',
    'Is my gold safe?',
    'How to sell gold?',
    'Delivery options'
  ];

  const handleQuickReply = (reply) => {
    setMessage(reply);
  };

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages, isTyping]);

  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageContainer,
      item.isUser ? styles.userMessage : styles.supportMessage
    ]}>
      <View style={[
        styles.messageBubble,
        item.isUser ? styles.userBubble : styles.supportBubble
      ]}>
        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={styles.messageTime}>{item.time}</Text>
        
        {item.isSuggestion && (
          <View style={styles.suggestionButtons}>
            <TouchableOpacity 
              style={styles.suggestionButton}
              onPress={() => handleSuggestionResponse('yes')}
            >
              <Text style={styles.suggestionButtonText}>Yes, please</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.suggestionButton, styles.noButton]}
              onPress={() => handleSuggestionResponse('no')}
            >
              <Text style={styles.suggestionButtonText}>No, thanks</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  const renderTypingIndicator = () => (
    <View style={[styles.messageContainer, styles.supportMessage]}>
      <View style={[styles.messageBubble, styles.supportBubble]}>
        <View style={styles.typingContainer}>
          <Text style={styles.typingText}>Digi Gold support is typing</Text>
          <View style={styles.typingDots}>
            <View style={styles.typingDot} />
            <View style={styles.typingDot} />
            <View style={styles.typingDot} />
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <View style={styles.header}>
        <View style={styles.supportInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>DG</Text>
          </View>
          <View>
            <Text style={styles.supportName}>Digi Gold Support</Text>
            <Text style={styles.supportStatus}>
              {isTyping ? 'Typing...' : 'Online • Typically replies instantly'}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.whatsappButton} onPress={openRealWhatsApp}>
          <Text style={styles.whatsappButtonText}>💬 Human Support</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id.toString()}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContainer}
        ListFooterComponent={isTyping ? renderTypingIndicator : null}
      />

      {messages.length === 1 && (
        <View style={styles.quickRepliesContainer}>
          <Text style={styles.quickRepliesTitle}>Quick questions:</Text>
          <View style={styles.quickReplies}>
            {quickReplies.map((reply, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickReply}
                onPress={() => handleQuickReply(reply)}
              >
                <Text style={styles.quickReplyText}>{reply}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={message}
          onChangeText={setMessage}
          placeholder="Type your message..."
          multiline
          onSubmitEditing={sendMessage}
          returnKeyType="send"
        />
        <TouchableOpacity 
          style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]} 
          onPress={sendMessage}
          disabled={!message.trim()}
        >
          <Text style={styles.sendButtonText}>📤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e5ddd5',
  },
  header: {
    backgroundColor: '#075e54',
    padding: 15,
    paddingTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  supportInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#25D366',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  supportName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  supportStatus: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },
  whatsappButton: {
    backgroundColor: '#25D366',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  whatsappButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    padding: 10,
  },
  messageContainer: {
    marginVertical: 5,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  supportMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 15,
  },
  userBubble: {
    backgroundColor: '#dcf8c6',
    borderBottomRightRadius: 5,
  },
  supportBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 5,
  },
  messageText: {
    fontSize: 16,
    color: '#000',
    lineHeight: 20,
  },
  messageTime: {
    fontSize: 11,
    color: '#666',
    marginTop: 5,
    textAlign: 'right',
  },
  suggestionButtons: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 10,
  },
  suggestionButton: {
    backgroundColor: '#25D366',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  noButton: {
    backgroundColor: '#666',
  },
  suggestionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingText: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  typingDots: {
    flexDirection: 'row',
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#666',
    marginHorizontal: 1,
    opacity: 0.6,
  },
  quickRepliesContainer: {
    padding: 15,
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 10,
  },
  quickRepliesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 10,
  },
  quickReplies: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickReply: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  quickReplyText: {
    fontSize: 12,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#f0f0f0',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#075e54',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default WhatsAppSupport;