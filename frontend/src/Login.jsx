const Login = ({onLogin}) => {
    return (
        <div className="Login">
        <input>email</input>
        <input>password</input>
        <button onClick={onLogin}>submit</button>
        </div>
    )}
    export default Login;