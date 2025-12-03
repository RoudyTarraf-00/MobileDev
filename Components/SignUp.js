import { 
  StyleSheet, 
  Text, 
  View,
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  Alert 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';

const SignUp = ({ navigation, users, setUsers }) => {
  const [notShowPassword, setNotShowPassword] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    email: '',
    name: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const UpdateField = (field, value) => {
    setForm({ ...form, [field]: value });
  };


  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email.toLowerCase());
  };

  const ValidateForm = async () => {
    setError('');

    if (
      form.email === '' ||
      form.password === '' ||
      form.confirmPassword === '' ||
      form.phone === '' ||
      form.name === ''
    ) {
      setError('All fields are required');
      return;
    }

    // ✅ CHECK VALID EMAIL
    if (!validateEmail(form.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (form.password.length < 8) {
      setError('Password must be atleast 8 chars');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords must match');
      return;
    }

    const user = users.find((e) => e.email === form.email);
    if (user) {
      setError('Email already in use');
      return;
    }

    const phone = users.find((e) => e.phone === form.phone);
    if (phone) {
      setError('Phone already in use');
      return;
    }

    console.log('Submitting');

    try {
      const response = await fetch(
        'https://mobileproject-arbab5hmekdwa0gv.francecentral-01.azurewebsites.net/api/users/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            phone: form.phone,
            password: form.password,
            balance: 0.0,
          }),
        }
      );

      if (response.ok) {
        const createdUser = await response.json();
        Alert.alert('Account Created Successfully');
        setUsers([...users, createdUser]);
        navigation.replace('Login');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Registration failed');
      }
    } catch (error) {
      console.error(error);
      setError('Error connecting to server');
    }
  };

  return (
    <KeyboardAvoidingView
      style={style.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={style.inner}>
        <Text style={style.welcome}>Sign Up!</Text>

        <Text style={style.error}>{error}</Text>

        {/* Name */}
        <Text style={style.label}>Name</Text>
        <View style={style.inputContainer}>
          <MaterialIcons name="person" size={20} color="blue" style={style.leftIcon} />
          <TextInput
            value={form.name}
            onChangeText={(text) => UpdateField('name', text)}
            style={style.textInput}
            placeholder="Enter your name"
          />
        </View>

        {/* Email */}
        <Text style={style.label}>Email</Text>
        <View style={style.inputContainer}>
          <MaterialIcons name="email" size={20} color="blue" style={style.leftIcon} />
          <TextInput
            value={form.email}
            onChangeText={(text) => UpdateField('email', text)}
            style={style.textInput}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Password */}
        <Text style={style.label}>Password</Text>
        <View style={style.inputContainer}>
          <MaterialIcons name="key" size={20} color="blue" style={style.leftIcon} />
          <TextInput
            value={form.password}
            onChangeText={(text) => UpdateField('password', text)}
            style={style.textInput}
            placeholder="Enter your password"
            secureTextEntry={notShowPassword}
          />
          <TouchableOpacity onPress={() => setNotShowPassword(!notShowPassword)}>
            <MaterialIcons
              name={notShowPassword ? 'visibility' : 'visibility-off'}
              size={20}
              color="blue"
              style={style.rightIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Confirm Password */}
        <Text style={style.label}>Confirm Password</Text>
        <View style={style.inputContainer}>
          <MaterialIcons name="key" size={20} color="blue" style={style.leftIcon} />
          <TextInput
            value={form.confirmPassword}
            onChangeText={(text) => UpdateField('confirmPassword', text)}
            style={style.textInput}
            placeholder="Confirm your password"
            secureTextEntry={notShowPassword}
          />
          <TouchableOpacity onPress={() => setNotShowPassword(!notShowPassword)}>
            <MaterialIcons
              name={notShowPassword ? 'visibility' : 'visibility-off'}
              size={20}
              color="blue"
              style={style.rightIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Phone */}
        <Text style={style.label}>Telephone</Text>
        <View style={style.inputContainer}>
          <MaterialIcons name="phone" size={20} color="blue" style={style.leftIcon} />
          <TextInput
            value={form.phone}
            onChangeText={(text) => UpdateField('phone', text)}
            style={style.textInput}
            placeholder="Enter your phone"
            keyboardType="phone-pad"
          />
        </View>

        {/* Button */}
        <TouchableOpacity style={style.button} onPress={ValidateForm}>
          <Text style={style.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <Text style={style.signUp} onPress={() => navigation.replace('Login')}>
          Already have an account? Login
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};



const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5F0FF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  inner: {
    width: '100%',
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

  label: {
    fontSize: 14,
    alignSelf: 'flex-start',
    color: '#111827',
    marginTop: 12,
    marginBottom: 4,
    fontWeight: '600',
  },

  error: {
    color: '#EF4444',
    marginBottom: 6,
    alignSelf: 'flex-start',
    fontSize: 13,
  },

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
    marginTop: 18,
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
    textDecorationLine: 'underline',
  },
});

export default SignUp;
