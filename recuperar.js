url_endpoint='https://api-carousel-sandbox.nueve09.io/v1/';
async function Recuperar() {
    const email= document.getElementById('email').value;
    const data = {
        email
    };
    try {
        const response = await fetch(url_endpoint+'users/recovery_password', {//endpoint que se use o lo que se vaya a usar
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('Se ha enviado un mensaje a su correo para la recuperacion de su contraseña');
            email='';
            window.location.href = "recovery.html";

        } else {
            alert('Usuario incorrecto. Por favor, inténtalo de nuevo.');
            
        }
    } catch (error) {
        console.error('Error:', error);
    }
}



//   ruta para la recuperacion /recovery_password/validate
//