import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getGeminiResponse } from '../services/geminiChatService';
import { getUserInfo } from '../services/getinfo'; // ✅ corrected path

export default function ChatScreen({ route }) {
  const username = route?.params?.username;

  const [messages, setMessages] = useState([
    { id: '1', sender: 'bot', text: 'Hi! I am you chatbot assistance. How may I assist you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [infoLoading, setInfoLoading] = useState(true);

  useEffect(() => {
    async function fetchUserInfo() {
      const data = await getUserInfo(username);
      setUserInfo(data);
      setInfoLoading(false);
    }

    fetchUserInfo();
  }, [username]);

  async function sendMessage() {
    if (!input.trim() || !userInfo) return;

    const userMessage = { id: Date.now().toString(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    const USER_INFO = `
      My name is ${userInfo.firstName.trim()} ${userInfo.lastName.trim()}.
      I am from ${userInfo.barangay}, ${userInfo.city}, ${userInfo.province}.
      I was born on ${userInfo.dob} and I identify as ${userInfo.gender}.
      My civil status is ${userInfo.status}.
      You should remember this information and use it to personalize your responses.
    `;

    const prompt = USER_INFO + '\nUser: ' + input;
    const botText = await getGeminiResponse(prompt);

    setMessages(prev => [
      ...prev,
      { id: Date.now().toString() + '_bot', sender: 'bot', text: botText }
    ]);
    setInput('');
    setLoading(false);
  }

  if (infoLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color="#e75e33" />
          <Text>Loading user info...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#e75e33" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Icon name="chatbubble-ellipses-outline" size={20} color="#fff" />
            <Text style={styles.headerTitle}>Gemini Chat</Text>
          </View>
          <TouchableOpacity>
            <Icon name="person-circle-outline" size={26} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Chat Area */}
        <FlatList
          data={messages}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View
              style={[
                styles.message,
                item.sender === 'user' ? styles.user : styles.bot
              ]}
            >
              <Text style={styles.messageText}>{item.text}</Text>
            </View>
          )}
          contentContainerStyle={styles.chatContainer}
        />

        {/* Input Row */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Type your message..."
            placeholderTextColor="#999"
            editable={!loading}
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={sendMessage}
            disabled={loading}
          >
            <Icon name="send" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#e75e33',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: Platform.OS === 'android' ? 32 : 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 8,
  },
  chatContainer: {
    flexGrow: 1,
    padding: 16,
    justifyContent: 'flex-end',
  },
  message: {
    marginVertical: 4,
    padding: 12,
    borderRadius: 10,
    maxWidth: '80%',
  },
  user: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
  },
  bot: {
    alignSelf: 'flex-start',
    backgroundColor: '#EEE',
  },
  messageText: {
    fontSize: 15,
    color: '#222',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    margin: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 8,
    color: '#000',
  },
  sendButton: {
    backgroundColor: '#e75e33',
    borderRadius: 8,
    padding: 8,
    marginLeft: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
