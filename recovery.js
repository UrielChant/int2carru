url_endpoint='https://api-carousel-sandbox.nueve09.io/v1/';
async function Enviar() {
    const email= document.getElementById('email').value;
    const token= document.getElementById('token').value;
    const password= document.getElementById('password').value;
    const password_confirm= document.getElementById('password_confirm').value;

    const data = {
        email,token,password,password_confirm
    };
    try {
        const response = await fetch(url_endpoint+'users/recovery_password/validate', {//endpoint que se use o lo que se vaya a usar
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('Se ha actualizado su contraseña');
            email='';
            token='';
            password='';
            password_confirm='';
            window.location.href = "index.html";

        } else {
            alert('las llaves son incorrectas. Por favor, verifique sus datos.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
