url_endpoint='https://api-carousel-sandbox.nueve09.io/v1/';//'https://api-carousel-prod.nueve09.io/v1/'; 
var temporal="";
var identidad="";
//------------------Inicio de sesion url+login------------------------
async function iniciarSesion() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const data = {
        email,
        password
    };
    try {
        const response = await fetch(url_endpoint+'users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const primero  = await response.json();
            token=primero.data.token;
            user=primero.data.user.email;
            localStorage.setItem('token',token);
            localStorage.setItem('user', user);
            document.getElementById('login').style.display = 'none';
            document.getElementById('anuncios').style.display = 'block';
            email.value='';
            password.value='';
            refrescar();
        } else {
            alert('Credenciales incorrectas. Por favor, inténtalo de nuevo.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
//----------------------------------------------------------------------------------------

//------------------getpool de anuncios url+ads--------------------------
async function refrescar() {
    try {
        const token=localStorage.getItem('token');
            const response = await fetch(url_endpoint+'ads?page=1&page_size=24', {//  /mobile   <--este faltante de liga me ayuda a entrar a un entorno de prueba/la paginacion debe ser desde aqui para andar subiendo los archivos
            method: 'GET',
            headers: {
           'Content-Type': 'application/json',
           'Authorization':`Bearer ${token}`
                  }
                    
         });
        const data=await response.json();
        const ads=data.data.ads;
        if (response.ok) {
            const tableBody = document.querySelector('#tablaDatos tbody');
            tableBody.innerHTML = '';
                ads.forEach(item => {
                    const row = tableBody.insertRow();
                    row.insertCell(0).textContent = item.name.substring(0,15);
                    row.insertCell(1).textContent = item.alias.substring(0,15);
                    row.insertCell(2).textContent = item.position;
                    row.insertCell(3).textContent = item.call_to_action.substring(0,15);
                    row.insertCell(4).textContent = item.id;
                    const state=document.createElement("button");
                    state.textContent=item.status;
                    state.addEventListener("click",()=> cambio_de_estado(item.id,item.name,item.alias,item.start_date,item.end_date,item.position,item.call_to_action,item.status));
                    row.insertCell(5).appendChild(state);
                    row.insertCell(6).textContent = item.user_id;
                    row.insertCell(7).textContent = item.start_date.substring(0,10);
                    row.insertCell(8).textContent = item.end_date.substring(0,10);

                    // var texturl=item.image;
                    // row.insertCell(9).textContent=texturl.substring(texturl.length-15);

                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Eliminar";
                deleteButton.addEventListener("click", () =>confirmacion(item.id))
                row.insertCell(9).appendChild(deleteButton);

                const viewButton = document.createElement("button");
                viewButton.textContent = "Visualizar";
                viewButton.addEventListener("click", () => veranuncio(item.id)); //aqui se coloca el identificador  para realizar lectura
                row.insertCell(10).appendChild(viewButton);

            });

        } else {
            console.error('Error al obtener los datos:', data.error);
        }
    } catch (error) {
        console.error('Error de red:', error);
    }
};
//----------------------------------------------------------------------

//------------------------visualiza anuncio url+ads+paginacion-------------------------------------------------------
async function veranuncio(itemId) {
    document.getElementById('anuncios').style.display = 'none';
    document.getElementById('anuncioid').style.display = 'block';
    try {
        const token=localStorage.getItem('token');
        const response = await fetch(url_endpoint+`ads/${itemId}`, {//?page=2&page_size=1
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${token}`
            },
        });
    const data = await response.json();
    const ads=data.data.ad;
    temporal=[ads.name,ads.alias,ads.position,ads.call_to_action,ads.end_date];
    if (response.ok) {
        const tableBody = document.querySelector('#tablaDatosads tbody');
        tableBody.innerHTML = ''; 

        var row2 = tableBody.insertRow();
        row2.insertCell(0).textContent = ads.name;
        row2.insertCell(1).textContent = ads.alias.substring(0,10);
        row2.insertCell(2).textContent = ads.position;
        var enlace = document.createElement("a");
        enlace.textContent = ads.call_to_action.substring(0,20);
        enlace.href=ads.call_to_action;
        enlace.target = '_blank';
        celdenl=row2.insertCell(3);
        celdenl.appendChild(enlace);
        row2.insertCell(4).textContent = ads.id;
        const state=document.createElement("button");
        state.textContent=ads.status;
        state.addEventListener("click",()=> cambio_de_estado(ads.id,ads.name,ads.alias,ads.start_date,ads.end_date,ads.position,ads.call_to_action,ads.status));
        row2.insertCell(5).appendChild(state);
        row2.insertCell(6).textContent = ads.user_id;
        row2.insertCell(7).textContent = ads.start_date;
        row2.insertCell(8).textContent = ads.end_date;
        identidad=ads.id;
        
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Eliminar";
        deleteButton.addEventListener("click", () => confirmacion(ads.id));//aqui se coloca el identificador  para realizar supresion
        row2.insertCell(9).appendChild(deleteButton);
        
        var row2 = tableBody.insertRow();
        var celdai=row2.insertCell();
        celdai.colSpan=10;
        if(ads.image!==null){
        var image=new Image();
        image.src=ads.image;
        image.style.maxWidth = "1080px"; 
        image.style.maxHeight = "600px"; 
        image.style.width = "auto";      
        image.style.height = "auto";
        celdai.appendChild(image);
        const deleteimg = document.createElement("button");
        deleteimg.textContent = "Eliminar";
        deleteimg.addEventListener("click", () => confirmacionim1(ads.id));//aqui se coloca el identificador  para realizar supresion
        celdai.appendChild(deleteimg);
        }
        else{
        var row2 = tableBody.insertRow();
        var celdai=row2.insertCell();
        celdai.colSpan=10;
        celdai.textContent="No hay imagen primaria que mostrar";
        }
        if(ads.image2!==null){
        var row2 = tableBody.insertRow();
        var celdai=row2.insertCell();
        celdai.colSpan=10;
        
        var image2=new Image();
        image2.src=ads.image2;
        image2.style.maxWidth = "1080px"; 
        image2.style.maxHeight = "600px"; 
        image2.style.width = "auto";      
        image2.style.height = "auto";
        celdai.appendChild(image2);
        const deleteimg2 = document.createElement("button");
        deleteimg2.textContent = "Eliminar";
        deleteimg2.addEventListener("click", () => confirmacionim2(ads.id));//aqui se coloca el identificador  para realizar supresion
        celdai.appendChild(deleteimg2);
        }
        else{
        var row2 = tableBody.insertRow();
        var celdai=row2.insertCell();
        celdai.colSpan=10;
        celdai.textContent="No hay imagen secundaria que mostrar";
        }

    } else {
        console.error('Error al obtener los datos:');
    }
}
catch (error) {
    console.error('Error de red:', error);
}
    
}
//---------------------vista de image--------------------------------------------

async function veranuncioimg(itemId) {
    try {
        const token=localStorage.getItem('token');
        const response = await fetch(url_endpoint+`ads/${itemId}/image/FIRST`, {//?page=2&page_size=1 aqui posiblmente sea otro endpoint
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${token}`
            },
        });
    const data = await response.json();
    const ads=data.data.ad;
    console.log(data,ads);
    if (response.ok) {
        const tableBody = document.querySelector('#tablaDatosads tbody');
        //tableBody.innerHTML = ''; 
        
        
        
        var row2 = tableBody.insertRow();
        var celdai=row2.insertCell();
        celdai.colSpan=10;
        
        var image=new Image();
        image.src=ads.image;//aqui se colocar la imagen que se tare dejson   
        image.style.maxWidth = "1080px"; 
        image.style.maxHeight = "600px"; 
        image.style.width = "auto";      
        image.style.height = "auto";
        celdai.appendChild(image);
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Eliminar";
        deleteButton.addEventListener("click", () => confirmacionim1(ads.id));//aqui se coloca el identificador  para realizar supresion
        celdai.appendChild(deleteButton);
    } else {
        console.error('Error al obtener los datos:');
    }
}
catch (error) {
    console.error('Error de red:', error);
}

        try {
            const token=localStorage.getItem('token');
            const response = await fetch(url_endpoint+`ads/${itemId}/image/SECONDARY`, {//?page=2&page_size=1 aqui posiblmente sea otro endpoint
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':`Bearer ${token}`
                },
            });
        const data = await response.json();
        const ads=data.data.ad;
        if (response.ok) {
            const tableBody = document.querySelector('#tablaDatosads tbody');
            //tableBody.innerHTML = ''; 

        var row2 = tableBody.insertRow();
        var celdai2=row2.insertCell();
        celdai2.colSpan=10;

        var image2=new Image();
        image2.src=ads.image;//aqui se colocar la imagen que se tare dejson
        image2.style.maxWidth = "1080px"; 
        image2.style.maxHeight = "600px"; 
        image2.style.width = "auto";      
        image2.style.height = "auto";
        celdai2.appendChild(image2);
        const deleteButton2 = document.createElement("button");
        deleteButton2.textContent = "Eliminar";
        deleteButton2.addEventListener("click", () => confirmacionim2(ads.id));//aqui se coloca el identificador  para realizar supresion
        celdai2.appendChild(deleteButton2);


    } else {
        console.error('Error al obtener los datos:');
    }
}
catch (error) {
    console.error('Error de red:', error);
}
};
//------------------------------------------------------------------------------

//--------------------------------subir imagen---------------------------------------------------
document.getElementById("enviarimg").addEventListener("click", async function() {

    const image = document.getElementById('img1');
    const image2 = document.getElementById('img2');
    const typimg="FIRST";
    const typimg2="SECONDARY";

    console.log(typeof image.files[0],typeof image2.files[0],typeof image.files,typeof image2.files);
        if (((typeof image.files[0])=='object')&&((typeof image2.files[0])=='object')){
            var formData = new FormData();
            formData.append('image', image.files[0]);
            envioimagen(typimg,formData)
            formData='';
            formData = new FormData();
            formData.append('image', image2.files[0]);
            envioimagen(typimg2,formData)
        }
        else if((typeof image2.files[0])=='object'){
            const formData = new FormData();
            formData.append('image', image2.files[0]);
            envioimagen(typimg2,formData)
        }
        else if((typeof image.files[0])=='object'){
            const formData = new FormData();
            formData.append('image', image.files[0]);
            envioimagen(typimg,formData)
        }
        else{
            alert('No hay nada que enviar')
        }
});



async function envioimagen(tipo,formData){
    try{
        const token=localStorage.getItem('token');
       const response= await fetch(url_endpoint+`ads/${identidad}/image/${tipo}`, {//ads/11/SECONDARY  O  FIRST
            method: "POST",
            headers:{
                'Authorization':`Bearer ${token}`
            },
            body: formData
        })
    
        if (response.ok) {
            alert('Subida exitosa');
            document.getElementById("img1").value='';
            document.getElementById("img2").value='';
            document.getElementById('form_img').style.display = 'none';
            document.getElementById('anuncios').style.display = 'block';
            refrescar();
          
        } else {
            alert('sucedio un problema.');
        }
    }
        catch(error){
            console.error("Error:", error);
        };
    };

// -------------------------subida de anuncio url+ads--------------------------------------
document.getElementById("enviar").addEventListener("click", async function() {

    const name = document.getElementById("campo1").value;
    const alias = document.getElementById("campo2").value;
    const call_to_action = document.getElementById("campo4").value;
    const start_date = document.getElementById("campo5").value;
    const end_date = document.getElementById("campo6").value;
    const position = document.getElementById("campo7").value;

    if((end_date>start_date)&&(position<25)&&((name!=='')&&(alias!=='')&&(call_to_action!=='')&&(start_date!=='')&&(end_date!=='')&&(position!==''))){
        try{
            const token=localStorage.getItem('token');
           const response= await fetch(url_endpoint+'ads', {
                method: "POST",
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization':`Bearer ${token}`
                },
                body:JSON.stringify({
                    "name": name,
                    "alias": alias,
                    "start_date": start_date,
                    "end_date": end_date,
                    "position": position,
                    "call_to_action": call_to_action})                
            }) 
        
            if (response.ok) {
                alert('Subida exitosa');
                document.getElementById("campo1").value='';
                document.getElementById("campo2").value='';
                document.getElementById("campo4").value='';
                document.getElementById("campo5").value='';
                document.getElementById("campo6").value='';
                document.getElementById("campo7").value='';
                document.getElementById('formulariocarrusel').style.display = 'none';
                document.getElementById('anuncios').style.display = 'block';
                refrescar();
              
            } else {
                alert('sucedio un problema.');
            }
        }
            catch(error){
                console.error("Error:", error);
            };
        

    }
    else if((position<25)&&((name!=='')&&(alias!=='')&&(call_to_action!=='')&&(start_date!=='')&&(end_date!=='')&&(position!==''))){
        alert('No procede los datos de la fecha no son correctos la fecha de termino debe superior a la fecha de inicio')
    }
    else if((end_date>start_date)&&((name!=='')&&(alias!=='')&&(call_to_action!=='')&&(start_date!=='')&&(end_date!=='')&&(position!==''))){
        alert('La posicion no debe de rebasar del numero 25')
    }
    else if(!(((name!=='')&&(alias!=='')&&(call_to_action!=='')&&(start_date!=='')&&(end_date!=='')&&(position!=='')))){
        alert('Se encuentran todos los campos vacios')
    }
    else if((position<25)&&(end_date>start_date)){
        alert('Hay un campo vacio no puedes enviar si hay un campo sin llenar')
    }
    else{
        alert('No procede los datos de la fecha no son correctos fecha de termino debe superior a la fecha de inicio, la posicion no debe de rebasar el numero 25 y hay un campo vacio, no puedes enviar si hay un campo sin llenar.')
    }
});
//-----------------------------------------------------------------------

//-----------------------eliminacion de anuncio url+ads+paginacion----------------------------------------------
async function borraranuncio(itemId) {
    const token=localStorage.getItem('token')
    try {
        const response = await fetch(url_endpoint+`ads/${itemId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${token}`
            },
        });

    if (response.ok) {
        alert("tu anuncio ha sido eliminado con exito");
        document.getElementById('anuncioid').style.display = 'none';
        document.getElementById('anuncios').style.display = 'block';
        refrescar();

    } 
    else {
        console.error('Error al obtener los datos:', data3.error);
    }
}
catch (error) {
    console.error('Error de red:', error);
}
}
//-----------------------------------------------------------------------------

//-----------------------eliminacion de imagenes----------------------------------------------
async function borrarimagen1(itemId) {
    const token=localStorage.getItem('token')
    try {
        const response = await fetch(url_endpoint+`ads/${itemId}/image/FIRST`, {//mapeo distinto para la imagen primaria?
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${token}`
            },
        });

    if (response.ok) {
        alert("tu imagen primaria");
        veranuncio(itemId)

    } 
    else {
        console.error('Error al obtener los datos:', data.error);
    }
}
catch (error) {
    console.error('Error de red:', error);
}
}

async function borrarimagen2(itemId) {
    const token=localStorage.getItem('token')
    try {
        const response = await fetch(url_endpoint+`ads/${itemId}/image/SECONDARY`, {//mapeo distinto para la imagen secundaria?
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${token}`
            },
        });

    if (response.ok) {
        alert("tu imagen secundaria");
        veranuncio(itemId)

    } 
    else {
        console.error('Error al obtener los datos:', data3.error);
    }
}
catch (error) {
    console.error('Error de red:', error);
}
}

//---------------------------------------------------------------------------------------

//-----------------------Modificar anuncio url+ads+paginacion-----------------------------
document.getElementById("actualizar").addEventListener("click", async function(){
    
    const name = document.getElementById("campo11").value;
    const alias = document.getElementById("campo22").value;
    const call_to_action = document.getElementById("campo44").value;
    const start_date = document.getElementById("campo55").value;
    const end_date = document.getElementById("campo66").value;
    const position = document.getElementById("campo77").value;
    let boolva = true;

    if((end_date>start_date)&&(position<25)&&((name!=='')&&(alias!=='')&&(call_to_action!=='')&&(start_date!=='')&&(end_date!=='')&&(position!==''))){
        try {
            const token=localStorage.getItem('token');
            const response = await fetch(url_endpoint+`ads/${identidad}`, {//aqui se debera de poner el id correspondiente
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':`Bearer ${token}`
                },
                body:JSON.stringify ({
                                name:name,
                                alias:alias,
                                start_date:start_date,
                                end_date:end_date,
                                position:position,
                                call_to_action:call_to_action,
                                status:boolva       
                }),
                
            });
    
            if (response.ok) {
                alert("tu anuncio ha sido actualizado con exito");
                document.getElementById('formulariocarrusel2').style.display = 'none';
                document.getElementById('anuncios').style.display = 'block';
                refrescar();
            } else {
                console.error('Error al actualizar los datos:');
            }
        } catch (error) {
            console.error('Error de red:', error);
        }
        

    }
    else if((position<25)&&((name!=='')&&(alias!=='')&&(call_to_action!=='')&&(start_date!=='')&&(end_date!=='')&&(position!==''))){
        alert('No procede los datos de la fecha no son correctos la fecha de termino debe superior a la fecha de inicio')
    }
    else if((end_date>start_date)&&((name!=='')&&(alias!=='')&&(call_to_action!=='')&&(start_date!=='')&&(end_date!=='')&&(position!==''))){
        alert('La posicion no debe de rebasar del numero 25')
    }
    else if(!(((name!=='')&&(alias!=='')&&(call_to_action!=='')&&(start_date!=='')&&(end_date!=='')&&(position!=='')))){
        alert('Se encuentran todos los campos vacios')
    }
    else if((position<25)&&(end_date>start_date)){
        alert('Hay un campo vacio no puedes enviar si hay un campo sin llenar')
    }
    else{
        alert('No procede los datos de la fecha no son correctos fecha de termino debe superior a la fecha de inicio, la posicion no debe de rebasar el numero 25 y hay un campo vacio, no puedes enviar si hay un campo sin llenar.')
    }
    
});
//----------------------------Modificar true false stado-------------------------------------------------------------
async function cambio_de_estado(id,named,aliasd,start,end,positiond,call,status){
    try {
    const token=localStorage.getItem('token');
    const response = await fetch(url_endpoint+`ads/${id}`, {//aqui se debera de poner el id correspondiente
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization':`Bearer ${token}`
        },
        body:JSON.stringify (data)
    });
    if (response.ok) {
        alert("El estado de tu anuncio ha sido actualizado con exito");
        if(document.getElementById('anuncios').style.display =='block' ){
            refrescar();
        }
        else{
            veranuncio(id);
        }
    } else {
        console.error('Error al actualizar los datos:');
    }
} catch (error) {
    console.error('Error de red:', error);
}
}
//-------------------------------------------------------------------------------------------------

//-------------------------funciones para trasladarse------------------------------------------------
document.getElementById("subir").addEventListener("click", function() {
    document.getElementById('anuncios').style.display = 'none';
    document.getElementById('formulariocarrusel').style.display = 'block';
    })
document.getElementById("subir_img").addEventListener("click", function() {
    document.getElementById('anuncioid').style.display = 'none';
    document.getElementById('form_img').style.display = 'block';
    })
document.getElementById("regresar").addEventListener("click", function() {
    document.getElementById('formulariocarrusel').style.display = 'none';
    document.getElementById('anuncios').style.display = 'block';
    })
document.getElementById("regresar2").addEventListener("click", function() {
    document.getElementById('anuncioid').style.display = 'none';
    document.getElementById('anuncios').style.display = 'block';
    refrescar();
    })
document.getElementById("regresarimg").addEventListener("click", function() {
    document.getElementById('form_img').style.display = 'none';
    document.getElementById('anuncioid').style.display = 'block';
    refrescar();
    })
document.getElementById("modificar").addEventListener("click", function() {
     campo11.value=temporal[0];
     campo22.value=temporal[1];
     campo77.value=temporal[2];
     campo44.value=temporal[3];
    document.getElementById('anuncioid').style.display = 'none';
    document.getElementById('formulariocarrusel2').style.display = 'block';
    })
document.getElementById("regresarf").addEventListener("click", function() {
    document.getElementById('formulariocarrusel2').style.display = 'none';
    document.getElementById('anuncioid').style.display = 'block';
    })
//-----------------------------------------------------------------------------------------

//-------------------------------cierre de sesión------------------------------------------
document.getElementById("cerrar").addEventListener("click",  function() {
    localStorage.removeItem('token');
    localStorage.removeItem('user')
    const tableBody = document.querySelector('#tablaDatos tbody');
    tableBody.innerHTML = '';
    document.getElementById('email').value='';
    document.getElementById('password').value='';
    document.getElementById('anuncios').style.display = 'none';
    document.getElementById('login').style.display = 'block';
    })
//-----------------------------------------------------------------------------------------

//---------------------------Condicionales---------------------------------------------
document.getElementById('miFormulario').addEventListener('button', function(e) {
    e.preventDefault();
  
    const selectedDate = new Date(document.getElementById('campo5').value);
    const endDate = new Date(document.getElementById('campo6').value);
    const currentDate = new Date();
  
    if (selectedDate < currentDate) {
      alert('Selecciona una fecha posterior a la fecha actual.');
    } else {
      console.log('La fecha seleccionada es válida.');
    }

    if (endDate<currentDate){
        alert('Selecciona una fecha posterior a la fecha actual.');
    } else {
      console.log('La fecha seleccionada es válida.');
    }
  });
  document.getElementById('miFormulario2').addEventListener('button', function(e) {
    e.preventDefault();
  
    const selectedDate = new Date(document.getElementById('campo55').value);
    const endDate = new Date(document.getElementById('campo66').value);
    const currentDate = new Date();
  
    if (selectedDate < currentDate) {
      alert('Selecciona una fecha posterior a la fecha actual.');
    } else {
      console.log('La fecha seleccionada es válida.');
    }

    if (endDate<currentDate){
        alert('Selecciona una fecha posterior a la fecha actual.');
    } else {
      console.log('La fecha seleccionada es válida.');
    }
  });
document.getElementById('login').addEventListener('button', function(e) {
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('emailError');
    const email = emailInput.value;
  
    if (!email) {
      e.preventDefault();
      emailError.textContent = 'El campo de correo electrónico es obligatorio';
      emailError.style.display = 'block';
    } else if (!isValidEmail(email)) {
      e.preventDefault();
      emailError.textContent = 'Ingrese un correo electrónico válido';
      emailError.style.display = 'block';
    } else {
      emailError.textContent = '';
      emailError.style.display = 'none';
    }
  });
  
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
//---------------------------------------------------------------------------------------
function confirmacion(identificacion){
var confirmacion = confirm('¿Estás seguro de que deseas realizar esta acción?');
            if (confirmacion) {
                borraranuncio(identificacion);
                alert('Acción realizada');
            } else {
                alert('Acción cancelada');
            }
        };

function confirmacionim1(identificacion){
var confirmacion = confirm('¿Estás seguro de que deseas realizar esta acción?');
            
            if (confirmacion) {
                borrarimagen1(identificacion);
                alert('Acción realizada');
            } else {
            alert('Acción cancelada');
            }
        };

function confirmacionim2(identificacion){
var confirmacion = confirm('¿Estás seguro de que deseas realizar esta acción?');
            if (confirmacion) {
                borrarimagen2(identificacion);
                alert('Acción realizada');
            } else {
            alert('Acción cancelada');
            }
            };
const fechaHoraActual = new Date().toISOString().slice(0, 16);
        
    document.getElementById("campo5").min = fechaHoraActual;
    document.getElementById("campo55").min = fechaHoraActual;

    const startDate = document.getElementById("campo5");
    const endDate = document.getElementById("campo6");
    const startDate2 = document.getElementById("campo55");
    const endDate2 = document.getElementById("campo66");
    startDate.addEventListener('input', function() {
        endDate.min = startDate.value;
    });
    startDate2.addEventListener('input', function() {
        endDate2.min = startDate2.value;
    });
