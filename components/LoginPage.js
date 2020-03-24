import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, Linking, Alert } from 'react-native';
import Constants from 'expo-constants';
import { TextInput } from 'react-native-gesture-handler';
import { CommonActions } from '@react-navigation/native';
import { connect } from 'react-redux';
import HealthScoreCalculator from '../tools/HealthScoreCalculator';

class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            signInError: '',
            username: '',
            password: '',
            isLoading: false,
            isLoadingFoods: false,
            loginSuccess: false,
        };
    }

    setHealthScores = () => {
        const foods = JSON.parse(JSON.stringify(this.props.foods.list));
        HealthScoreCalculator.setHealthScore(foods, this.props.user.diet);
        this.props.setFoods(foods);
    }

    getFoods = () => {
        this.setState({ isLoadingFoods: true });
        fetch('http://192.168.1.116:5000/foods', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(res => res.json()).then(json => {
            this.setState({ isLoadingFoods: false });
            if (json.result == 1) {
                this.props.setFoods(json.foods);
                this.setHealthScores();
                this.props.navigation.dispatch(CommonActions.reset({
                    index: 0,
                    routes: [
                        {
                            name: 'Drawer',
                        },
                    ],
                }));
            }
        }).catch(err => {
            console.log(err);
            this.setState({
                isLoading: false,
            });
        });
    }

    onLogin = () => {
        this.setState({ isLoading: true });
        fetch('http://192.168.1.116:5000/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password,
            }),
        }).then(res => res.json()).then(json => {
            Alert.alert("Notification received: ", json.message);
            if (json.result == 1) {
                this.setState({
                    isLoading: false,
                    loginSuccess: true,
                });
                this.props.setUser(json.user);
                this.getFoods();
            }
            else {
                this.setState({
                    signInError: json.message,
                    isLoading: false,
                });
            }
        }).catch(err => {
            console.log(err);
            this.setState({
                isLoading: false,
            });
        });
    }

    render() {
        if (this.state.isLoading) {
            return (
                <View style={styles.viewStyle}>
                    <Text>Loading...</Text>
                </View>
            );
        }

        if (this.state.isLoadingFoods) {
            return (
                <View style={styles.viewStyle}>
                    <Text>Loading Foods...</Text>
                </View>
            );
        }

        return (
            <View style={styles.viewStyle}>
                <Text style={styles.textStyleTitle}>
                    Login
                </Text>
                <TextInput
                    style={{ fontSize: 20 }}
                    placeholder="Username"
                    value={this.state.username}
                    onChangeText={text => { this.setState({ username: text }) }}
                />
                <Text style={styles.textStyle}> </Text>
                <TextInput
                    style={{ fontSize: 20 }}
                    placeholder="Password"
                    onChangeText={text => { this.setState({ password: text }) }}
                    value={this.state.password}
                />
                <Text style={styles.textStyle}> </Text>
                <Button onPress={this.onLogin} title="Login" />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    viewStyle: {
        flex: 1,
        backgroundColor: '#664466',
        marginTop: Constants.statusBarHeight,
        justifyContent: 'center',
        padding: 20,
    },
    textStyleTitle: {
        color: "white",
        textAlign: 'center',
        fontSize: 30,
        marginBottom: 30,
    },
    textStyle: {
        color: "white",
        marginBottom: 0,
        justifyContent: 'center',
    },
});

const mapStateToProps = (state) => {
    return {
        user: state.user,
        foods: state.foods,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setUser: (user) => {
            dispatch({
                type: "SET_USER",
                payload: user,
            });
        },
        setFoods: (foods) => {
            dispatch({
                type: "SET_FOODS",
                payload: foods,
            });
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
