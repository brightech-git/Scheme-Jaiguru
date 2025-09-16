import React from "react";
import { StyleSheet, View, Dimensions, ScrollView } from "react-native";
import { WebView } from "react-native-webview";

const { width } = Dimensions.get("window");

export default function MainPageWithYouTube() {
  const iframeHtml = `
    <html>
      <head>
        <style>
          body, html {
            margin: 0;
            padding: 0;
            background: #000;
            height: 100%;
            width: 100%;
            overflow: hidden;
          }
          iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: none;
          }
        </style>
      </head>
      <body>
        <iframe src="https://www.youtube.com/embed/Yt3AWvxTgVw?si=X4Ocsgo1suRIH5gY"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen>
        </iframe>
      </body>
    </html>
  `;

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <WebView
          style={styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          source={{ html: iframeHtml }}
          allowsFullscreenVideo={true}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 20,
  },
  container: {
    width: width * 0.95,
    aspectRatio: 16 / 9, // keeps responsive ratio
    borderRadius: 10,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    backgroundColor: "#000",
  },
  webview: {
    flex: 1,
  },
});
