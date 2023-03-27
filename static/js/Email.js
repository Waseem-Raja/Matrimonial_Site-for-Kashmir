const form = document.querySelector('form');

 const contact= async ()=>{

  debugger
    // form.preventDefault();
    const name=form.fromnamec.value;
    const email=form.emailc.value;
    const msg= form.messagec.value;
    console.log(name + " " + email);

    let options={
      method: 'POST',
      body: JSON.stringify({ name},{email},{message:msg}),
      headers: {'Content-type': 'application/json' }
    }

    const res = await fetch('/contactus', options);
    // {
    //   method: 'POST',
    //   body: JSON.stringify({ name},{email},{message:msg}),
    //   headers: {'Content-type': 'application/json' }
    // });

    const result = await res.json();
    console.log(result);

    alert(result.msg);

    

}

    
  
