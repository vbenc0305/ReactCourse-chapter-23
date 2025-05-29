import AuthForm from '../components/AuthForm';
import {redirect} from "react-router-dom";



function AuthenticationPage() {
  return <AuthForm />;
}

export default AuthenticationPage;

export async function action({ request }) {
    const params = new URL(request.url).searchParams
    const mode = params.get('mode') || 'login';

    if(mode !== 'login' && mode !== 'signup'){
        throw new Response(
            JSON.stringify({ message: 'Invalid mode' }),
            {
                status: 422,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }

    const formData = await request.formData();
    const authData = {
        email: formData.get('email'),
        password: formData.get('password'),
    }

    const response = await fetch('http://localhost:8080/'+mode , {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(authData),
    }
    );

    if(response.status === 422 || response.status === 401){
        return response;
    }

    if (!response.ok) {
        throw new Response(
            JSON.stringify({ message: 'Could not authenticate user' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }

    const responseData = await response.json();
    const token = responseData.token;

    localStorage.setItem('token', token);
    const expiration = new Date();
    expiration.setHours(expiration.getHours() + 1);
    localStorage.setItem('expiration', expiration.toISOString());

    //soon manage that token
    return redirect('/');
}