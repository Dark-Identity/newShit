function select(tag){
  return document.querySelector(`${tag}`);
}
function selectAll(tag){
  return document.querySelectorAll(`${tag}`);
}
// menue m_menue_section

let m_menue_section = document.querySelector('#middle-one');
let m_menue_return = document.querySelector('.m-popup-return');
let m_popup_menue = document.querySelector('.m-popup-menue');

m_menue_section.addEventListener("click" , ()=>{
  m_popup_menue.style.animation = "precede 1.5s ease-in-out forwards";
})

m_menue_return.addEventListener('click' , ()=>{
  m_popup_menue.style.animation = "recede 1.5s ease-in-out forwards"
})

//m-menue section ends here





// bets page

const bet_section = document.querySelector('#bet-box');

function load_bet_box(){

  const match_cards = document.querySelectorAll('.bet_card');

  match_cards.forEach((item, i) => {

  item.addEventListener('click' , ()=>{

   // getting all the details

    let details = item.querySelectorAll('.match_details');
    // console.log(details);

    let league_id = details[0].innerText;
    let league = details[1].innerText;
    let team_a = details[2].innerText;
    let team_b = details[3].innerText;
    let time = details[4].innerText;
    let today = new Date();

    let date = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

    let to_fill = document.querySelectorAll('.details_fillup');

    to_fill[0].innerText = team_a;
    to_fill[1].innerText = team_b;
    to_fill[2].innerText = time;
    to_fill[3].innerText = league_id;
    to_fill[4].innerText = date;
    to_fill[5].innerText = league;

    bet_section.style.left  = "0";
   })

  });
}

// setting up the percentages of bet page on window load

let bet_box = document.querySelector('.b-table').querySelectorAll('div');

const profit_percents = {
  "Mon" : ['4.5%' , '6.8%' , '2.3%'],
  "Tue" : ['2.3%' , '4.5%' , '6.8%','2.3%' , '4.5%' , '6.8%','2.3%' , '4.5%' , '6.8%','2.3%' , '4.5%' , '6.8%','2.3%' , '4.5%' , '6.8%','2.3%' , '4.5%' , '6.8%'],
  "Wed"  : ['1.2%'  ,'12.2'],
  'Thu'  : ['1.2%'  ,'12.2'],
  'Fri'  : ['1.2%'  ,'12.2'],
  'Sat'  : ['1.2%'  ,'12.2'],
  'Sun'  : ['1.2%'  ,'12.2']
}


window.addEventListener('load' , ()=>{

  let date = Date();
  let today = date.slice(0 , 3);

  bet_box.forEach((item, i) => {
    item.children[1].innerText = profit_percents[today][i];
  });

})



// percentage setting ends here;

// adding event listener to the bets for placing the bets

const place_bets = document.querySelector('#place-bets');
let spans = document.querySelector('.p-amount-heading').querySelectorAll('span');
let p_input = document.querySelector('.p-amount-heading').querySelector('input');

bet_box.forEach((item, i) => {

  item.addEventListener('click' , ()=>{

    let score = item.firstElementChild.innerText;
    let percentage = item.querySelectorAll('span')[1].innerText;


    spans[3].innerText = percentage;

    document.querySelector('.score-condition').lastElementChild.innerText = score;

    let p_fillup = document.querySelectorAll('.p_bet_filllup');
    let to_fill = document.querySelectorAll('.details_fillup');

    p_fillup[0].innerText = to_fill[0].innerText; //teama
    p_fillup[1].innerText = to_fill[1].innerText; //team_b
    p_fillup[2].innerText = to_fill[4].innerText; //date
    p_fillup[3].innerText = to_fill[2].innerText; //time


    place_bets.style.display = "grid";

  })

});

let p_ammount = document.querySelectorAll('.p-bet-amount-blocks > span');
p_ammount.forEach((item, i) => {
  item.addEventListener('click' , ()=>{

    p_ammount.forEach((test, j) => {
      test.classList.remove("yellow");
    });

    item.classList.add('yellow');
    document.querySelector('.p-amount-heading > input').value = item.innerText.trim();

  })

});


p_input.addEventListener('keyup' , ()=>{

  let value =
  Number(p_input.value) * Number(spans[3].innerText.slice(0 ,3));

  spans[4].innerText = parseFloat(value.toFixed(2));

})

document.querySelector('.p-bet-bottom').lastElementChild.addEventListener("click" , ()=>{

  place_bets.style.display = "none";

})


// bet placing ends here;



// bets page ends here



// funcation to load pages

function load_pages(page){


  if(window.innerWidth <= 490){
    page.style.left = "0px";
    page.style.width = "100vw";
    page.style.height  = `100vh`;
  }else{
    page.style.left = "70px";
  }
  page.scrollTo(0,0)
  // console.log(page.parentElement);
}

function return_pages(page){
  page.style.left = "-100vw"
}

// affiliate center linking the pages

let affiliate_btn = document.querySelectorAll('.affiliate')
let records_btn = document.querySelectorAll('.records');
let trade_btn = document.querySelectorAll('.trade-list');
let promotion_btn = document.querySelectorAll(".promotion");
let tutorial_btn = document.querySelectorAll(".tutorial");
let virtual_league_btn = document.querySelectorAll(".virtual_league");
let events_btn = document.querySelectorAll(".events");
let spinner_pop_btn = document.querySelector('.spinner_pop_btn');
let profile_btn = document.querySelectorAll('.profile_btn');


let profile_page = document.querySelector('#profile');
let spinner_page = document.querySelector('#spinner');
let events_page = document.querySelector("#main-box");
let virtual_league_page = document.querySelector("#virtual_league");
let tutorial_page = document.querySelector("#tutorial");
let promotion_page = document.querySelector("#promotion");
let affiliate_page = document.querySelector('#affiliate')
let records_page = document.querySelector('#records');
let trade_page = document.querySelector('#trade-list');


profile_btn.forEach((item, i) => {
  item.addEventListener('click' , ()=>{
    return_pages(records_page);
    return_pages(trade_page);
    return_pages(virtual_league_page);
    return_pages(promotion_page);
    return_pages(tutorial_page);
    return_pages(trade_page);
    return_pages(affiliate_page);
    load_pages(profile_page);
  })
});

affiliate_btn.forEach((item, i) => {
  item.addEventListener('click' , ()=>{
    return_pages(records_page);
    return_pages(trade_page);
    return_pages(virtual_league_page);
    return_pages(promotion_page);
    return_pages(profile_page);
    return_pages(tutorial_page);
    load_pages(affiliate_page);
  })
});

records_btn.forEach((item, i) => {
  item.addEventListener('click' , ()=>{
    return_pages(profile_page);
    return_pages(affiliate_page);
    return_pages(trade_page);
    return_pages(virtual_league_page);
    return_pages(promotion_page);
    return_pages(tutorial_page);
    load_pages(records_page);
  })
});

trade_btn.forEach((item, i) => {
  item.addEventListener('click' , ()=>{
    return_pages(profile_page);
    return_pages(affiliate_page);
    return_pages(records_page);
    return_pages(virtual_league_page);
    return_pages(promotion_page);
    return_pages(tutorial_page);
    load_pages(trade_page);
  })
});

tutorial_btn.forEach((item, i) => {
  item.addEventListener('click' , ()=>{
    return_pages(profile_page);
    return_pages(affiliate_page);
    return_pages(records_page);
    return_pages(virtual_league_page);
    return_pages(promotion_page);
    return_pages(trade_page)
    load_pages(tutorial_page);
  })
});

promotion_btn.forEach((item, i) => {
  item.addEventListener('click' , ()=>{
    return_pages(affiliate_page);
    return_pages(trade_page)
    return_pages(profile_page);
    return_pages(records_page);
    return_pages(virtual_league_page);
    return_pages(tutorial_page);
    load_pages(promotion_page);
  })
});

virtual_league_btn.forEach((item, i) => {
  item.addEventListener('click' , ()=>{
    return_pages(affiliate_page);
    return_pages(profile_page);
    return_pages(trade_page)
    return_pages(records_page);
    return_pages(promotion_page);
    return_pages(tutorial_page);
    load_pages(virtual_league_page);
  })
});

events_btn.forEach((item, i) => {
  item.addEventListener('click' , ()=>{
    return_pages(affiliate_page);
    return_pages(profile_page);
    return_pages(trade_page)
    return_pages(records_page);
    return_pages(promotion_page);
    return_pages(tutorial_page);
    return_pages(virtual_league_page);
  })
});

spinner_pop_btn.addEventListener('click' , ()=>{
  load_pages(spinner_page);
})

// inside affiliate linking

// affiliate top three buttons linking
document.querySelectorAll('.aff_top_buttons').forEach((item, i) => {
  item.addEventListener('click' , ()=>{
    let the_page =  document.querySelectorAll(".aff-top-button_popups")[i];
    the_page.style.left = "0";
    the_page.parentElement.scrollTo(0,0)
  })

});

// affiliate top buttons linking ends;

document.querySelectorAll('.aff-new-register').forEach((item , i)=>{

  item.addEventListener('click', ()=>{
    let the_section = document.querySelectorAll('.aff-pop-register')[i];
    the_section.style.left = '0'
    // console.log(the_section.parentElement);
    the_section.parentElement.scrollTo(0,0);

  })

});

let aff_cut_box = document.querySelectorAll('.aff-cut-box');

aff_cut_box.forEach((cut_box, i) => {

  cut_box.addEventListener('click' , ()=>{
    return_pages(cut_box.parentElement);
    // cut_box.parentElement.style.left = "-100vw";
  })

});

// inside affiliate linking ends

// affiliate center page linking ends here




// linking the crousel photos

document.querySelectorAll('.carousel__slide').forEach((item, i) => {

  const val = ['../photos/INVITE.jpg' , '../photos/BONUS.jpg' , '../photos/AGENT.jpg' , '../photos/SALARY.jpg'];

  item.addEventListener('click' , ()=>{
    document.querySelector('.background').style.backgroundImage = `url('${val[i]}')`;
    document.querySelector('.slider-popup').style.left = '0';
  })

});


// deposit page linking

function load_payment_pages(page){
  page.style.left = "0px";
  page.parentElement.scrollTo(0,0)
}

function return_payment_pages(page){
  page.style.left = "-100vw";
}

let deposit_page = document.querySelector('#deposit');
document.querySelector('#deposit_btn').addEventListener('click' , ()=>{
  load_payment_pages(deposit_page);
});

let priviliges_page = document.querySelector('#privilage_page');
document.querySelector('#vip').addEventListener('click' , ()=>{
   load_payment_pages(priviliges_page);
})

document.querySelector('#deposit_cancel').addEventListener('click' , ()=>{
  return_payment_pages(deposit_page);
});


let withdraw_page = document.querySelector('#withdraw');
document.querySelector('#withdraw_btn').addEventListener('click' , ()=>{
  load_payment_pages(withdraw_page)
});

document.querySelector('#withdraw_cancel').addEventListener('click' , ()=>{
  return_payment_pages(withdraw_page)
});

// response page for every payment;
let payment_res_page = document.querySelector('#withdraw_response');
document.querySelector('#withdraw_res_btn').addEventListener('click' , ()=>{
  return_payment_pages(payment_res_page);
})
let payment_res_paragraph = document.querySelector('#pay_res');

// response page for payment ends;

let usdt_page = document.querySelector('#usdt_page');
document.querySelector('#usdt_btn').addEventListener('click' , ()=>{
  load_payment_pages(usdt_page);
})

document.querySelector("#usdt_done_btn").addEventListener('click' , ()=>{

  payment_res_paragraph.innerText = "Your ammount will soon be added."

  load_payment_pages(payment_res_page);
  return_payment_pages(usdt_page);
  return_payment_pages(deposit_page);

})

document.querySelector('#withdraw_request').addEventListener('click' , ()=>{

  // if(trades >= 6){
    payment_res_paragraph.innerText = "Your request is in pending."
    // } else{
      //   change the backgroud to withdraw_res_err;
      //   payment_res_paragraph.innerText = "Play a minimum of 6 matches."
      // }
      load_payment_pages(payment_res_page);
      return_payment_pages(withdraw_page);
    })


    // linking all the profile_bottom pages

    let popup_pages =  document.querySelectorAll('.p-f-bottom_pops');

    document.querySelectorAll('.prof_bottom').forEach((item, i) => {
      item.addEventListener('click' , ()=>{
        profile_page.scrollTo(0,0);
        load_payment_pages(popup_pages[i]);
      })

    });

    // linking all the user info page btns for change_number

    let user_pages_tochange = document.querySelectorAll('.user_change_pages');
    document.querySelectorAll('.user_change_btn').forEach((item, i) => {
      item.addEventListener('click' , ()=>{
        load_payment_pages(user_pages_tochange[i]);
      })
    });

    let info_cancel_btn =  document.querySelectorAll('.info_cancel_btn');

    info_cancel_btn.forEach((item, i) => {
      item.addEventListener('click' , ()=>{
        item.parentElement.parentElement.parentElement.style.left = '-100vw';
      })
    });


    // linkgin of all user info page btns ends

    // linking done;


    let bank_inpt_page = document.querySelector('#bank_detail_inpt');

    document.querySelector('#add_bank_info').addEventListener('click' , ()=>{
      // validate for preexistance of data;
      load_payment_pages(bank_inpt_page);
    })

    document.querySelector('#bank_inpt_cancel').addEventListener('click' , ()=>{
      return_payment_pages(bank_inpt_page);
    })



    // trc linking

    let trc_text = document.querySelector('#trc_text');
    document.querySelector('#trc_btn').addEventListener('click' , ()=>{

      trc_text.select();
      trc_text.setSelectionRange(0, 99999);

      navigator.clipboard
      .writeText(trc_text.value)
      .then(() => {
        alert("successfully copied");
      })
      .catch(() => {
        alert("something went wrong");
      });

    })

    // trc deposit trc_btn
    let trc_buttons =  document.querySelectorAll('.tdb');

    trc_buttons.forEach((item, i) => {
      item.addEventListener('click' , ()=>{

        trc_buttons.forEach((test, j) => {
          test.classList.remove("yellow");
        });

        item.classList.add('yellow');
         document.querySelector('#trc_input').value = parseFloat(item.innerText.slice(2 , 4));
      })

    });

    // trc linking done

// upi deposit buttons
let upi_buttons =  document.querySelectorAll('.udb');

upi_buttons.forEach((item, i) => {
  item.addEventListener('click' , ()=>{

    upi_buttons.forEach((test, j) => {
      test.classList.remove("yellow");
    });

    item.classList.add('yellow');
     document.querySelector('#upi_input').value = parseFloat(item.innerText);
  })
});




// usdt cancel btns

let usdt_cancel = document.querySelector('#usdt_cancel');
usdt_cancel.addEventListener('click', ()=>{
  usdt_cancel.parentElement.parentElement.parentElement.style.left = '-100vw';
})

// creating the swipper in privilage section
var swiper = new Swiper(".mySwiper", {
  effect: "coverflow",
  grabCursor: true,
  centeredSlides: true,
  slidesPerView: "auto",
  observer : true,
  coverflowEffect: {
    rotate: 0,
    stretch: 0,
    depth: 100,
    modifier: 1,
    slideShadows: true,
  },
  on: {
    slideChange: function () {
      const index_currentSlide = this.realIndex;
      const currentSlide = this.slides[index_currentSlide]

      const values = [[1000,2100] , [1000 , 4200] , [1000,8500] , [1000,17000] , [1000,34000]];

      let min_withdrawal = values[index_currentSlide][0];
      let max_withdrawal = values[index_currentSlide][1];

      let to_change = document.querySelectorAll('.priv-info-change');

      to_change[0].innerText = min_withdrawal;
      to_change[1].innerText  = max_withdrawal;

    },
  },
});

// invitation link copy btn

select('.invi_link_btn').addEventListener('click' , ()=>{
  let text = select('.s_invitation');

  text.select();
  text.setSelectionRange(0, 99999);

  navigator.clipboard
  .writeText(text.value)
  .then(() => {
    alert("successfully copied");
  })
  .catch(() => {
    alert("something went wrong");
  });


})

// bet deletion

let tradeDel_cancel_btn = document.querySelector('#trade_del_canc');
tradeDel_cancel_btn.addEventListener('click' , ()=>{
  tradeDel_cancel_btn.parentElement.parentElement.style.display  = 'none';
})

// league id is not getting delivered to the backend

let bet_cancel_btn = selectAll('.trade_cut_querry');

bet_cancel_btn.forEach((item, i) => {

  item.children[0].addEventListener('click' , async ()=>{

     let value = item.parentElement.querySelector('.del_leagueid').innerText;

     let data = await JSON.stringify({value : value});

     const config = {
       method : 'POST',
       headers:{
         'content-type' : 'application/json'
       },
       body : data
     }


     let res = await fetch('/delbet' , config);
     let parsed_response = await res.json();

     if(parsed_response['status'] == 1){
       window.location.href = window.location.origin + '/home';
     }else if(parsed_response['status'] == 2){

       alert('Bet cannot be deleted now . ')
     }else if(parsed_response['status'] == 0){
       window.location.href = window.location.origin + '/login';
     }

  })

});



function listen_to_cancel_bet(){

   selectAll('.bet_cut_btn').forEach((item, i) => {

      item.addEventListener('click' , ()=>{
        let del_box = select('.trade_del_box')
        select('.del_leagueid').innerText = item.parentElement.querySelector('.leagueID').innerText;

        del_box.style.display = 'block';

      })

   });

}



// backend part



// start a loading animation which will end at last fetch call;

let user_information;
// let bet_data;

get_user_data();
get_bet_history();
get_all_members();
get_live_bets();
get_virtual_bets();


// setters

function create_match(data){

  let parent_box = document.querySelector('#matches_box');
  let match_card = document.createElement('div');
  match_card.classList.add('match-card');
  match_card.classList.add('bet_card');

  let body = `  <p class="id match_details">${data['fixture_id']}</p>
    <div class="match_details league">
      <h3>${data['league']}</h3>
    </div>
    <div class="teams-section">
      <div class="match-info team-1">
        <h4 class="match_details">${data['team_a']}</h4>
        <h4 class="match_details">${data['team_b']}</h4>
      </div>
      <div class="vs-img"></div>
      <div class="match-info match-time">

      <h4 style = "font-weight : 900; letter-spacing : 2px;">
        Today
      </h4>

      <h4 class="match_details">${data['date'].getHours()}:${data['date'].getMinutes()}
      </h4>


      </div>

    </div>
`
  match_card.innerHTML = body;
  parent_box.append(match_card);
}

function set_user_data(info){

  selectAll('.s_invitation').forEach((item, i) => {
    item.value = `${window.location.origin + '/signup' + '/' +info['inv']}`;
    // console.log(`${window.location.origin + '/signup'+'/'+ info['inv']}`);
  });

  document.querySelectorAll('.s_name').forEach((item, i) => {
    item.innerText = info['name']
  });
  document.querySelectorAll('.s_inv_code').forEach((item, i) => {
    item.innerText = info['inv'];
  });
  document.querySelectorAll('.s_balance').forEach((item, i) => {
    item.innerText = info['balance'];
  });
  document.querySelectorAll('.s_vip').forEach((item, i) => {
    item.innerText = `VIP${info['vipLevel']}`;
  });
  document.querySelectorAll('.s_members').forEach((item, i) => {
    item.innerText = info['members'];
  });

}

function create_settled_bets(data){

  let parent = select('#records > .matches-box');
  let child = document.createElement('div');
  child.classList.add('match-card');

  let body = `<div class="league">
      <h3>${data['league']}</h3>
      <h3 style = "color : green">${data['scoreDetails'][0]['first']} - ${data['scoreDetails'][0]['second']} </h3>
      <h3 style = 'color : green'>${data['bAmmount']}</h3>

      <h3>result - ${data['final_score'][0]['first']} -${data['final_score'][0]['second']}
      </h3>

    </div>
    <div class="teams-section">
      <div class="match-info team-1">
        <h4 class="match_details">${data['team_a']}</h4>
        <h4 class="match_details">${data['team_b']}</h4>
      </div>
      <div class="vs-img"></div>
      <div class="match-info match-time">

      <h4 style = "font-weight : 900; letter-spacing : 2px;">
        ${data['date']}
      </h4>

      <h4 class="match_details">${data['time']}
      </h4>


      </div>

    </div>
`
  child.innerHTML = body;

  parent.append(child);
}

function check_date(date , time ){

  let today = new Date();
  let match_date = date.split(/\//);
  let m_time = time.split(/\:/);
  let m_date = parseInt(match_date[0]);
  let m_month = parseInt(match_date[1]);
  let m_hours = parseInt(m_time[0]);
  let m_minutes = parseInt(m_time[1]);
  m_minutes += 5;

  let valid_date = (parseInt(today.getDate()) == m_date);
  let valid_hour = (parseInt(today.getHours()) < m_hours);
  let valid_minutes = (parseInt(today.getMinutes()) < m_minutes );
  let equal_hours = parseInt(today.getHours()) == m_hours;

  let to_return = '';

  if(valid_date && valid_hour || equal_hours && valid_minutes){
    to_return = '<h3 style = "color : red" class = "bet_cut_btn">CANCEL</h3>'
    return to_return;
  }

  return to_return;

}

function create_unsettled_bets(data){

  let parent = select('#trade-list > .matches-box');
  let child = document.createElement('div');

  child.classList.add('match-card');

  let cut_box = check_date(data['date'] , data['time']);

  let body = `<div class="league">
      <p class = "leagueID" style = "display : none">${data['leagueId']}</p>
      <h3>${data['league']}</h3>
      <h3 style = "color : green">${data['scoreDetails'][0]['first']} - ${data['scoreDetails'][0]['second']} </h3>
      <h3 style = 'color : green'>${data['bAmmount']}</h3>
      ${cut_box}
    </div>
    <div class="teams-section">
      <div class="match-info team-1">
        <h4 class="match_details">${data['team_a']}</h4>
        <h4 class="match_details">${data['team_b']}</h4>
      </div>
      <div class="vs-img"></div>
      <div class="match-info match-time">

      <h4 style = "font-weight : 900; letter-spacing : 2px;">
        ${data['date']}
      </h4>

      <h4 class="match_details">${data['time']}
      </h4>


      </div>

    </div>
`
  child.innerHTML = body;

  parent.append(child);
}

function create_members(data){
  // console.log(data);
  let pages = selectAll('.aff-top-button_popups');
  let bottom_pages = selectAll('.aff-pop-register');

  let user_profit = 0;
  let user_amount = 0;
  let total_bets_played = 0;
  let total_members = parseInt(data['direct_members'].length) + parseInt(data['level2_user'][0].length) + parseInt(data['level3_user'][0].length);
  let total_withdrawal = 0;
  let sub_members_count = total_members - parseInt(data['direct_members'].length);

  let page_first = pages[0].lastElementChild.lastElementChild;//members page
  let page_second = pages[1] //report page

  let bottom_first = bottom_pages[0].lastElementChild.lastElementChild; //new registers
  let bottom_second = bottom_pages[1].lastElementChild.lastElementChild; //new deposit
  let bottom_third = bottom_pages[2].lastElementChild.lastElementChild;  //new bets
  let bottom_forth = bottom_pages[3].lastElementChild.lastElementChild;  //new withdrawals

  for(let item of data['direct_members']){
    // console.log(item);
    user_profit = (parseFloat(user_profit) + parseFloat(item['profit'])).toFixed(3);
    user_amount = (parseFloat(user_amount) + parseFloat(item['deposit'])).toFixed(3);
    total_bets_played = parseInt(total_bets_played) + parseInt(item['betPlayed']);
    total_withdrawal = parseInt(total_withdrawal) +  parseInt(item['withdrawalC']);


    let child_mem_page = document.createElement('div');
    child_mem_page.classList.add('aff-register-person-box');

    let child_new_register = document.createElement('div');
    child_new_register.classList.add('aff-register-person-box')

    let child_new_deposit = document.createElement('div');
    child_new_deposit.classList.add('aff-register-person-box');

    let child_new_bets = document.createElement('div');
    child_new_bets.classList.add('aff-register-person-box');

    let child_new_withdraw = document.createElement('div');
    child_new_withdraw.classList.add('aff-register-person-box');

    let body_new_withdraw = `<span>${item['user']}</span><span>LEVEL-1</span><span>${item['withdrawalC']}</span>`;
    let body_new_bets = `<span>${item['user']}</span><span>LEVEL-1</span><span>${item['betPlayed']}</span>`;
    let body_new_dposit = `<span>${item['user']}</span><span>LEVEL-1</span><span>${item['deposit']}</span>`;
    let body_new_register = `<span>${item['user']}</span><span>LEVEL-1</span><span>${item['members']}</span>`;
    let body_mem_page = `<span>${item['user']}</span><span>LEVEL-1</span><span>${item['profit']}</span>`;


    child_mem_page.innerHTML = body_mem_page;
    child_new_register.innerHTML = body_new_register;
    child_new_bets.innerHTML = body_new_bets;
    child_new_withdraw.innerHTML = body_new_withdraw;
    child_new_deposit.innerHTML = body_new_dposit;

    page_first.append(child_mem_page);
    bottom_first.append(child_new_register);
    bottom_second.append(child_new_deposit);
    bottom_third.append(child_new_bets);
    bottom_forth.append(child_new_withdraw);

  }

  for(let item of data['level2_user'][0]){

    user_profit = (parseFloat(user_profit) + parseFloat(item['profit'])).toFixed(3);
    user_amount = (parseFloat(user_amount) + parseFloat(item['deposit'])).toFixed(3);
    total_bets_played = parseInt(total_bets_played) + parseInt(item['betPlayed']);
    total_withdrawal = parseInt(total_withdrawal) +  parseInt(item['withdrawalC']);

        let child_mem_page = document.createElement('div');
        child_mem_page.classList.add('aff-register-person-box');

        let child_new_register = document.createElement('div');
        child_new_register.classList.add('aff-register-person-box')

        let child_new_deposit = document.createElement('div');
        child_new_deposit.classList.add('aff-register-person-box');

        let child_new_bets = document.createElement('div');
        child_new_bets.classList.add('aff-register-person-box');

        let child_new_withdraw = document.createElement('div');
        child_new_withdraw.classList.add('aff-register-person-box');

        let body_new_withdraw = `<span>${item['user']}</span><span>LEVEL-2</span><span>${item['withdrawalC']}</span>`;
        let body_new_bets = `<span>${item['user']}</span><span>LEVEL-2</span><span>${item['betPlayed']}</span>`;
        let body_new_dposit = `<span>${item['user']}</span><span>LEVEL-2</span><span>${item['deposit']}</span>`;
        let body_new_register = `<span>${item['user']}</span><span>LEVEL-2</span><span>${item['members']}</span>`;
        let body_mem_page = `<span>${item['user']}</span><span>LEVEL-2</span><span>${item['profit']}</span>`;


        child_mem_page.innerHTML = body_mem_page;
        child_new_register.innerHTML = body_new_register;
        child_new_bets.innerHTML = body_new_bets;
        child_new_withdraw.innerHTML = body_new_withdraw;
        child_new_deposit.innerHTML = body_new_dposit;

        page_first.append(child_mem_page);
        bottom_first.append(child_new_register);
        bottom_second.append(child_new_deposit);
        bottom_third.append(child_new_bets);
        bottom_forth.append(child_new_withdraw);

  }

  for(let item of data['level3_user'][0]){
   // console.log(item);
   user_profit = (parseFloat(user_profit) + parseFloat(item['profit'])).toFixed(3);
   user_amount = (parseFloat(user_amount) + parseFloat(item['deposit'])).toFixed(3);
   total_bets_played = parseInt(total_bets_played) + parseInt(item['betPlayed']);
   total_withdrawal = parseInt(total_withdrawal) +  parseInt(item['withdrawalC']);


        let child_mem_page = document.createElement('div');
        child_mem_page.classList.add('aff-register-person-box');

        let child_new_register = document.createElement('div');
        child_new_register.classList.add('aff-register-person-box')

        let child_new_deposit = document.createElement('div');
        child_new_deposit.classList.add('aff-register-person-box');

        let child_new_bets = document.createElement('div');
        child_new_bets.classList.add('aff-register-person-box');

        let child_new_withdraw = document.createElement('div');
        child_new_withdraw.classList.add('aff-register-person-box');

        let body_new_withdraw = `<span>${item['user']}</span><span>LEVEL-3</span><span>${item['withdrawalC']}</span>`;
        let body_new_bets = `<span>${item['user']}</span><span>LEVEL-3</span><span>${item['betPlayed']}</span>`;
        let body_new_dposit = `<span>${item['user']}</span><span>LEVEL-3</span><span>${item['deposit']}</span>`;
        let body_new_register = `<span>${item['user']}</span><span>LEVEL-3</span><span>${item['members']}</span>`;
        let body_mem_page = `<span>${item['user']}</span><span>LEVEL-3</span><span>${item['profit']}</span>`;


        child_mem_page.innerHTML = body_mem_page;
        child_new_register.innerHTML = body_new_register;
        child_new_bets.innerHTML = body_new_bets;
        child_new_withdraw.innerHTML = body_new_withdraw;
        child_new_deposit.innerHTML = body_new_dposit;

        page_first.append(child_mem_page);
        bottom_first.append(child_new_register);
        bottom_second.append(child_new_deposit);
        bottom_third.append(child_new_bets);
        bottom_forth.append(child_new_withdraw);
  }

  // console.log(total_members , user_amount , sub_members_count , total_bets_played , total_withdrawal , total_members);
  pages[0].lastElementChild.firstElementChild.firstElementChild.lastElementChild.innerText = total_members;
  pages[0].lastElementChild.firstElementChild.lastElementChild.lastElementChild.innerText = user_profit;
  pages[1].lastElementChild.firstElementChild.firstElementChild.lastElementChild.innerText = total_members;
  pages[1].lastElementChild.firstElementChild.lastElementChild.lastElementChild.innerText = user_amount;
  bottom_pages[0].lastElementChild.firstElementChild.firstElementChild.lastElementChild.innerText = total_members;
  bottom_pages[0].lastElementChild.firstElementChild.lastElementChild.lastElementChild.innerText = sub_members_count;
  bottom_pages[1].lastElementChild.firstElementChild.firstElementChild.lastElementChild.innerText = total_members;
  bottom_pages[1].lastElementChild.firstElementChild.lastElementChild.lastElementChild.innerText = user_amount;
  bottom_pages[2].lastElementChild.firstElementChild.firstElementChild.lastElementChild.innerText = total_members;
  bottom_pages[2].lastElementChild.firstElementChild.lastElementChild.lastElementChild.innerText = total_bets_played;

  bottom_pages[3].lastElementChild.firstElementChild.firstElementChild.lastElementChild.innerText = total_members;
  bottom_pages[3].lastElementChild.firstElementChild.lastElementChild.lastElementChild.innerText = total_withdrawal;

  return;
}
// getters

async function get_user_data(){

 let config = {
    method : 'GET',
    headers : {
      'content-type' : 'application/json'
    }
  }

  let res =  await fetch('/user_data' , config);
  let user_information = await res.json();

  if(user_information['status'] === 1){
    set_user_data(user_information);
  }else if(user_information['status'] === 0){
    window.location.href = window.location.origin + '/login';
  }

}

async function get_live_bets(){

  let today = new Date();

   let url = `https://v3.football.api-sports.io/fixtures/?date=${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}&status=NS`;

   let res =
   await fetch(url, {
    "method": "GET",
    "headers": {
        "x-rapidapi-host": "v3.football.api-sports.io",
        "x-rapidapi-key": "021ae6685ec46e47ec83f8848ac1d168"
          // "x-rapidapi-key": "823296afa77a4989062591abc46178ee"
      }
  })

  let matches = await res.json();
  let count = 1;

  for(let item of matches['response']){

    if(count > 50){
      count++;
      break;
    }

    let date = new Date(item['fixture']['date']);

    let match_data = {
      date : date,
      fixture_id : item['fixture']['id'],
      team_a : item['teams']['home']['name'],
      team_b : item['teams']['away']['name'],
      league : item['league']['name']
    };

    if(today.getDate() == date.getDate() && date.getHours() > today.getHours() ||
       today.getDate() == date.getDate() && date.getHours() == today.getHours() && date.getMinutes() > (today.getMinutes() + 20)){
         // console.log(today.getDate() , today.getHours() , today.getMinutes());
         // console.log(date.getDate() , date.getHours() , date.getMinutes());
      count++;
      create_match(match_data);
    }

  }

load_bet_box();

}

async function get_virtual_bets(){

  let today = new Date();

   let url = `https://v3.football.api-sports.io/fixtures/?date=${today.getFullYear() - 5}-${today.getMonth()+1}-${today.getDate()}&status=FT`;


   let res =
   await fetch(url, {
    "method": "GET",
    "headers": {
        "x-rapidapi-host": "v3.football.api-sports.io",
        "x-rapidapi-key": "021ae6685ec46e47ec83f8848ac1d168"
          // "x-rapidapi-key": "823296afa77a4989062591abc46178ee"
      }
  })

  let matches = await res.json();
  let count = 1;

  for(let item of matches['response']){

    if(count > 50){
      break;
    }

    let date = new Date(item['fixture']['date']);

    let match_data = {
      date : date,
      fixture_id : item['fixture']['id'],
      team_a : item['teams']['home']['name'],
      team_b : item['teams']['away']['name'],
      league : 'virtual'
    };


    if(today.getDate() == date.getDate() && date.getHours() > today.getHours() ||
       today.getDate() == date.getDate() && date.getHours() == today.getHours() && date.getMinutes() > today.getMinutes()){

      count++;
      create_match(match_data);

    }

  }

load_bet_box();

}

async function get_all_members(){

  let config = {
    method : 'GET',
    headers : {
      'content-type' : 'application/json'
    }
  };

  let response = await fetch('/get_all_members' , config);
  response = await response.json();

  if(response['status'] == 1){
    create_members(response);
  }else if(response['status'] == 0){
    window.location.href = window.location.origin + '/login';
  }

}

async function get_bet_history(){

  let config = {
    method : 'GET',
    headers : {
      'content-type' : 'application/json'
    }
  }
  let res = await fetch('/get_bet_history' , config);

  res = await res.json();

  if(res['status'] === 0){
    window.location.href = window.location.origin + '/login';
  }else if(res['status'] === 1){

    // console.log(res['unsetteled_bets'] , res['settled_bets']);

    if(res['unsetteled_bets']){
      res['unsetteled_bets'].forEach((item, i) => {
        create_unsettled_bets(item);
      });
      listen_to_cancel_bet();
    }
    // console.log(res);
    if(res['setteled_bets']){
      res['setteled_bets'].forEach((item, i) => {
        create_settled_bets(item);
      });
    }

  }

}

async function get_payment() {

}


// place bets send data => db

function checkBalance(bet_ammount){
  let balance = parseInt(select('.s_balance').innerText);
  return (bet_ammount <= balance)?  true :  false;
}

select('.p-bet-bottom > button[name = p-submit]').addEventListener('click' , async ()=>{

  let b_details =  select('.p-amount-heading').children;
  let details_fillup = selectAll('.details_fillup');
  let p_fillup = selectAll('.p_bet_filllup');
  let scores = select('.score-condition').lastElementChild.innerText;
  let score_first = scores.slice(0,1);
  let score_second = scores.slice(2,3);

  // if(checkBalance(parseFloat(b_details[3].value))){

  let data = {};

  data['league_id'] = parseInt(details_fillup[3].innerText);
  data['league'] =    details_fillup[5].innerText;
  data['team_a'] =    p_fillup[0].innerText;
  data['team_b'] =    p_fillup[1].innerText;
  data['date']   =    p_fillup[2].innerText;
  data['time']   =    p_fillup[3].innerText;
  data['first']  = score_first;
  data['second'] = score_second;
  data['profit'] = parseFloat(b_details[4].innerText.slice(0 , -1));
  data['ammount'] = parseFloat(b_details[3].value);
  data['l_type'] = parseInt((details_fillup[5].innerText == 'virtual')? 0 : 1);

  // if(await checkBalance(data['ammount'])){
    const config = {
    method : 'POST',
    headers:{
      'content-type' : 'application/json'
    },
    body : await JSON.stringify(data)
  }

    let res = await fetch('/placebet' , config);
    res = await res.json();

    if(res['status'] == 1){

      window.location.reload();

     }else if(res['status'] == 2){
        alert('bet already exist . Try deleting before next try .');
     }else if(res['status'] == 0){

         setTimeout(function () {
           alert('someting went wrong !!!');
         }, 2000);

        window.location.href = window.location.origin + '/login';
     }else if(res['status'] == 3){
        alert('TIME LIMIT EXEDED !!');
        window.location.reload();

     }else if (res['status'] == 4){
       alert('LOW BALANCE');
       window.location.reload();
     }

   // }else{
   //   alert('LOW BALANCE');
   // }

});
