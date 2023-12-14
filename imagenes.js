 async function upimg(url_endpoint,identidad) {

    const image1 = document.getElementById("img1");
    //const image2 = document.getElementById("img2");
    const image2=image1.files[0];

   // const archivo2=image2.files[0];
    console.log(image2);
    // const formData =('image', archivo); 
    // const formData = new FormData();
    // formData.append('image', archivo);
   // formData.append('image2', archivo2);
          
    if((image1!=='')&&(image2!=='')){
        var type='FIRST'
        try{
            const token=localStorage.getItem('token');
           const response= await fetch(url_endpoint+`ads/${identidad}/image/${type}`, {//ads/11/SECONDARY  O  FIRST
                method: "POST",
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization':`Bearer ${token}`
                },
                body: JSON.stringify ({image:image2})
            })
        
            if (response.ok) {
                alert('Subida exitosa');
                image1.value='';
                //image2.value='';
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
    else if(image1!==""){
        var type='FIRST';
        try{
            const token=localStorage.getItem('token');
           const response= await fetch(url_endpoint+`ads/${identidad}/image/${type}`, {//ads/11/SECONDARY  O  FIRST
                method: "POST",
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization':`Bearer ${token}`
                },
                body: JSON.stringify ({image:image2})
            })
        
            if (response.ok) {
                alert('Subida exitosa');
                image1.value='';
                //image2.value='';
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
}