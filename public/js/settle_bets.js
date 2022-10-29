
  let tag = document.querySelector('#res_data');

  document.querySelector('button').addEventListener('click' , async()=>{
    let id = document.querySelector('input').value;

    if(id){

      let data = {'id' : id};

      const config = {
      method : 'POST',
      headers:{
        'content-type' : 'application/json'
      },
      body :  await JSON.stringify(data)
    }

      let response = await fetch('/AdMiNgRoUp/league_0' , config);
      response = await response.json();
      tag.innerText = response;

    }else{
      alert('CHECK THE ID !!!!');
    }
  });
