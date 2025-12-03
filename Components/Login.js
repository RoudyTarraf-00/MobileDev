import { 
  StyleSheet, 
  Text, 
  View,
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';

const Login = ({ navigation, users, setUsers }) => {
  const [notShowPassword, setNotShowPassword] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const UpdateField = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const ValidateForm = async () => {
    setError('');

    if (form.email === '' || form.password === '') {
      setError('All fields are required');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `https://mobileproject-arbab5hmekdwa0gv.francecentral-01.azurewebsites.net/api/users/login?email=${encodeURIComponent(
          form.email
        )}&password=${encodeURIComponent(form.password)}`,
        {
          method: 'POST',
        }
      );

      if (response.ok) {
        const user = await response.json();

        if (user && Object.keys(user).length > 0) {
          navigation.replace('HomePage', { user });
        } else {
          setError('Email or password is incorrect');
        }
      } else {
        const errText = await response.text();
        setError('Login failed: ' + errText);
      }
    } catch (err) {
      console.error(err);
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={style.container}>
        <ActivityIndicator size={80} />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={style.container}
    >
      <View style={style.inner}>
        <Text style={style.welcome}>Welcome to RCB!</Text>

        <Text style={style.error}>{error}</Text>

        {/* Email */}
        <Text style={style.label}>Email</Text>
        <View style={style.inputContainer}>
          <MaterialIcons
            name="email"
            size={20}
            color="#2563EB"
            style={style.leftIcon}
          />
          <TextInput
            value={form.email}
            onChangeText={(text) => UpdateField('email', text)}
            style={style.textInput}
            placeholder="Enter your email"
            placeholderTextColor="#9CA3AF"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Password */}
        <Text style={style.label}>Password</Text>
        <View style={style.inputContainer}>
          <MaterialIcons
            name="key"
            size={20}
            color="#2563EB"
            style={style.leftIcon}
          />
          <TextInput
            value={form.password}
            onChangeText={(text) => UpdateField('password', text)}
            style={style.textInput}
            secureTextEntry={notShowPassword}
            placeholder="Enter your password"
            placeholderTextColor="#9CA3AF"
          />
          <TouchableOpacity
            onPress={() => setNotShowPassword(!notShowPassword)}
          >
            <MaterialIcons
              name={notShowPassword ? 'visibility' : 'visibility-off'}
              size={20}
              color="#2563EB"
              style={style.rightIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Button */}
        <TouchableOpacity style={style.button} onPress={ValidateForm}>
          <Text style={style.buttonText}>Login</Text>
        </TouchableOpacity>

        <Text
          style={style.signUp}
          onPress={() => {
            navigation.replace('SignUp');
          }}
        >
          Dont have an account? Sign up
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5F0FF', // match app background
    justifyContent: 'center',
    alignItems: 'center',
  },
  inner: {
    width: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  welcome: {
    fontSize: 28,
    color: '#020C2F',
    alignSelf: 'flex-start',
    marginBottom: 10,
    fontWeight: '800',
  },
  error: {
    color: '#EF4444',
    marginBottom: 10,
    alignSelf: 'flex-start',
    fontSize: 13,
  },
  label: {
    fontSize: 14,
    alignSelf: 'flex-start',
    color: '#111827',
    marginTop: 14,
    marginBottom: 4,
    fontWeight: '600',
  },

  // New input container with flexbox (fixes iOS alignment)
  inputContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    paddingVertical: 6,
    marginLeft: 8,
  },

  leftIcon: {
    backgroundColor: '#E0ECFF',
    padding: 6,
    borderRadius: 10,
  },

  rightIcon: {
    backgroundColor: '#E0ECFF',
    padding: 6,
    borderRadius: 10,
    marginLeft: 8,
  },

  button: {
    backgroundColor: '#2563EB',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 28,
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 16,
  },
  signUp: {
    textDecorationLine: 'underline',
    color: '#2563EB',
    marginTop: 18,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default Login;
