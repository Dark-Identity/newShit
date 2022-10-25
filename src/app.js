const express  = require('express');
const hbs = require('hbs');
const parser = require('cookie-parser');
const {User, Bet ,Deposit,Withdrawal} = require('./db');
const path = require('path');
const auth = require('./auth');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken' );
const cookieParser = require('cookie-parser');

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded());
app.set('view engine' , 'hbs');


let static_path = path.join( __dirname , '../' , 'public' );

app.use(express.static(static_path));

const port = process.env.PORT || 2000;

let link = 'mongodb+srv://herofootball:hero%40123@cluster0.ujlhaqb.mongodb.net/heroFootball?retryWrites=true&w=majority';


let temp_user = {
  number : 0,
  inv : 0,
  last_spin : 0,
  parent : 0
}

// module.exports = temp_user;

const JWT_SECRET = 'VISHAL';

async function verify_user(req , res) {

  const token = await req.cookies.id;
  if(token){
    let user_parsed_data = await jwt.verify(token , JWT_SECRET);

    return (user_parsed_data['_id'] === temp_user['id'])? true : false;
  }else{
    return false;
  }

}

app.get('/' , (req , res)=>{
  res.render('login');
})

let code;

app.get('/invited' , (req,res)=>{
  res.render('login' , {inv_code : code});
})

app.get('/signup/:id' , (req,res)=>{
  console.log(req.params);
  code = parseInt(req.params['id']);
  console.log(code);
  res.writeHead(301, { "Location": '/invited' });
  res.end();
})

// get all the data

app.get('/user_data' , async (req , res)=>{

  let data ;

  if(!temp_user['number'] || !verify_user(req,res)){
    res.send({status : 0});
  }else{
    try {

     let db_data = await User.findOne({phone : temp_user['number']})

      data = {
        name : db_data.user,
        inv  : db_data.inv,
        members : db_data.members,
        balance : db_data.Ammount,
        BankDetails : db_data.BankDetails,
        RebadeBonus : db_data.RebadeBonus,
        WithdrawalDetails : db_data.WithdrawalDetails,
        phone : db_data.phone,
        betPlayed : db_data.betPlayed,
        profit : db_data.profit,
        vipLevel : db_data.vipLevel,
        status : 1
      };

    } catch (e) {

      console.log(e);
      res.send({status : 0});

    } finally {

      if(verify_user(req,res)){
        res.send(data);
      }else{
        res.send({status : 0})
      }

    }
  }

});

app.get('/bet_data' , async (req , res)=>{

  let data ;

  if(!temp_user['number'] || await !verify_user(req , res)){
    res.send({status : 0});
  }else{

    try {

    let setteled_bets = await Bet.find({phone : temp_user['number'] , settled : true});
    let unsetteled_bets = await Bet.find({phone : temp_user['number'] , settled : false});
    console.log(settled_bets , unsetteled_bets);

    } catch (e) {
      console.log(e);
      res.send({status : 0});
    } finally {
      data = [
        setteled_bets , unsetteled_bets , {status : 1}
      ]
      if(await verify_user(req,res)){
        res.send(data);
      }
    }
  }

});

app.get('/get_payment' , async (req,res)=>{

 if(!number){
   res.render('login');
 }else{

  let data;

  let withdrawal = await Withdrawal.find({phone : number});
  let deposit = await Depost.find({phone : number });

  data = {withdrawal , deposit};
  res.send(data);
 }
});

app.get('/get_all_members' ,   async (req,res)=>{

  let data = [];

  if(temp_user['inv']){

    let direct_members = await User.find(
      {parent : temp_user['inv']},
      {_id : 0 , user : 1 , members : 1 , Ammount : 1 , WithdrawalDetails : 1  , betPlayed : 1 , withdrawalC : 1 , inv : 1}
    );
    data.push(direct_members);
    for(let i = 0 ; i< direct_members.length(); i++){
     let level2 =   await User.find(
        {parent : direct_members[i].inv},
        {_id : 0 , user : 1 , members : 1 , Ammount : 1 , WithdrawalDetails : 1  , betPlayed : 1 , withdrawalC : 1 , inv : 1}
      );
      data.push(level2);
      for(let j = 0 ; j < level2.length(); j++){
        let level3 =  await User.find(
           {parent : level2[j].inv},
           {_id : 0 , user : 1 , members : 1 , Ammount : 1 , WithdrawalDetails : 1  , betPlayed : 1 , withdrawalC : 1 , inv : 1}
         );
         data.push(level3);
      }

    }

    res.send(data);

  }else{
    res.render('login');
  }
});

app.get('/get_bet_history' , async (req,res)=>{

  if(temp_user['number'] && await verify_user(req , res)){

    let setteled_bets = await Bet.find({phone : temp_user['number'] , settled : true} , {_id : 0 , team_a : 1 , team_b : 1 , scoreDetails : 1 , final_score : 1 , date : 1 , profit : 1 , time : 1 , league : 1  , bAmmount : 1, leagueId : 1});

    let unsetteled_bets = await Bet.find({phone : temp_user['number'] , settled : false} , {_id : 0 , team_a : 1 , team_b : 1 , scoreDetails : 1  , date : 1 , profit : 1 , time : 1 , league : 1 , bAmmount : 1 , leagueId : 1});

    let data = {setteled_bets,unsetteled_bets , status : 1};

    res.send(data);

  }else{
    res.send({status : 0});
  }

}); //done


app.post('/placebet' , async (req,res)=>{

  let date = Date.now();
  let bet_exist = await Bet.findOne(
    {
    phone : temp_user['number'] ,
    team_a :  req.body.team_a ,
    team_b : req.body.team_b ,
    settled: false
  }
  );

  if(temp_user['number'] && !bet_exist && await verify_user(req , res)){

    let data = {
      phone : temp_user['number'],
      inv : temp_user['inv'],
      parent : temp_user['parent'],
      bAmmount : req.body.ammount,
      leagueId : req.body.league_id,
      league : req.body.league,
      team_a :  req.body.team_a,
      team_b : req.body.team_b,
      scoreDetails : [
        {
          first : req.body.first,
          second: req.body.second
        }
      ],
      date : req.body.date,
      time : req.body.time,
      profit : req.body.profit,
    }

    console.log(data);

    if(newBet(data)){
      res.send({'status' : 1});;
    }else{
      res.send({'status' : 0});
    }
  }else{
    res.send({'status' : 0});
  }

});

async function check_date(date , time ){

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

  if(valid_date && valid_hour || equal_hours && valid_minutes){
    return true;
  }
  return false;

}

app.post('/delbet', async (req,res)=>{

  if(await verify_user(req , res)){

   let id = parseInt(req.body.value);
   let bet = await Bet.findOne({leagueId : id});

   if(bet){

     let valid_date = await check_date(bet['date'] , bet['time']);

     if(valid_date){

       let is_deleted = await Bet.findOneAndDelete({leagueId : id });
       if(is_deleted){
         res.send({status : 1});
       }else{
         console.log('bet is not deleted');
         res.send({status : 0});
       }

     }else{
       res.send({status : 2})
     }

   }else{
     res.send({status : 0})
   }

 }else{
   res.send({status : 0})
 }

})

app.get('/virtual_bets', async(req,res)=>{

  let today = new Date;
  today = '' + today.getMonth() + today.getDate();

  let data = [];

  data.push(virtual_matches[today]);

  res.send(data);

});

// all data gathered

app.get("/home" , (req,res)=>{

  // if(temp_user['last_spin'] !== 0 && temp_user['last_spin'] < date.now().getDate()){
    res.render('home' , {
      spinner : `<div class="spinner_pop_btn">

                 </div>`
     })
  // }
  // res.render('home')

});

app.get('/login' , (req , res)=>{
  res.render("login");
});

app.get('/betfault' , (req,res)=>{
  res.render('betfault');
})

app.post('/signup' , async (req,res)=>{

  let body = req.body;

  let inv = await generate_inv_code();

  let user_found = await User.findOne({user : body.name});
  let phone_found = await User.findOne({phone : body.contact});

  let data = {
    user : body.name,
    password : body.password,
    inv : inv,
    parent : body.invitation_code,
    phone : body.contact
  }
  let newUser = new User(data);

  if(body.invitation_code !== 0 && !user_found && !phone_found){

    let parent = await User.findOne({inv : body.invitation_code});

    if(parent){

      const token = await newUser.generateToken();

      res.cookie("id" , token , {
        expires : new Date(Date.now() + 60000000),
        httponly : true
      })

      let is_created = await createUser(newUser);

      if(is_created){

        await increment_parent_mem(body.invitation_code);
        return res.send({status : 1});

      }else{
        return res.send({status : 0})
      }

    }else{
      return res.send({status : 0})
    }


  }else if(body.invitation_code == 0 && !user_found && !phone_found){

    let is_user_created = await createUser(newUser);

    if(is_user_created){

      const token = await newUser.generateToken();

      res.cookie("id" , token , {
        expires : new Date(Date.now() + 60000000),
        httponly : true
      });

      return res.send({status : 1});

    }else{
      return res.send({status : 0});
    }

  }else{
    if(user_found){
      return res.send({status : 404});
    }else if(phone_found){
      return res.send({status : 101})
    }else{
      return res.send({status : 0})
    }
  }

})

app.post('/login' , async (req , res)=>{

  let data = req.body;
  let db_user = await User.findOne({user : data.name});

  if(
    db_user !== null &&
    db_user.password.localeCompare(data.pass) == 0
    ){

      temp_user['id'] = db_user['_id'].valueOf();
      temp_user['number'] = db_user['phone'];
      temp_user['inv'] = db_user['inv'];
      temp_user['name'] = db_user['user'];
      temp_user['parent'] = db_user['parent'];


    const token = await db_user.generateToken();

    res.cookie('id' , token , {
      expires : new Date(Date.now() + 600000),
      httponly : true
    });

    res.send({status : 1});

  }else{
    res.send({status : 0});
  }


})

app.post('/AdMiNgRoUp/league_0' , async(req,res)=>{

  let settled = [];
  let all_unsettled_bets = await Bets.find({settled : false , league : 0});

  if(all_unsettled_bets){

    let level1_profit = 0;
    let level2_profit = 0;
    let level3_profit = 0;

    for(let i = 0; i<all_unsettled_bets.length(); i++){

      let node_parent = all_unsettled_bets[i]['inv'];
      let level1 = await Bets.find({parent : node_parent , settled : false , league : 0});

      if(level1){

        for(let j = 0 ; j< level1.length(); j++){

          if(
            level1[j]['scoreDetails']['first'] !== result['first'] ||
            level1[j]['scoreDetails']['second'] !== result['second']
          ){

            let b_amm1 = parseFloat(level1[j]['bAmmount']);
            let b_profit1 = parseFloat(level2[j]['profit']);
            let total_amm1 = b_amm1/100 * b_profit1;
            level1[j]['ammount'] = (level1[j]['bAmmount'] + total_amm1).toFixed(3);
            level1_profit += total_amm1;

          }

          let level1_parent = level1[j]['inv'];
          let level2 = await Bets.find({parent : level1_parent , settled : false});

            if(level2){
              for(let k = 0; k < level2.length(); k++){

                if(
                  level2[k]['scoreDetails']['first'] !== result['first'] ||
                  level2[k]['scoreDetails']['second'] !== result['second']
                ){

                  let b_amm2 = parseFloat(level2[k]['bAmmount']);
                  let b_profit2 = parseFloat(level2[k]['profit']);
                  let total_amm2 = b_amm2/100 * b_profit2;
                  level2[k]['ammount'] = (level2[k]['bAmmount'] + total_amm2).toFixed(3);
                  level2_profit += total_amm2;

                }

                 let level2_parent = level2[k]['inv'];
                 let level3 = await Bets.find({parent : level2_parent , settled : false});

                   if(level3){
                      for(let l = 0; l<level3.length(); l++){

                        if(
                          level3[l]['scoreDetails']['first'] !== result['first'] ||
                          level3[l]['scoreDetails']['second'] !== result['second']
                        ){

                          let b_amm3 = parseFloat(level3[l]['bAmmount']);
                          let b_profit3 = parseFloat(level3[l]['profit']);
                          let total_amm3 = b_amm3/100 * b_profit3;
                          level3[l]['ammount'] = (level3[l]['bAmmount'] + total_amm3).toFixed(3);
                          level3_profit += total_amm3;

                        }

                      }

                   }

              }

            }

        }

      }

      let node_prev_rebade = parseFloat(all_unsettled_bets[i]['prev_rebade']);
      level1_profit = level1_profit/100 * 14;
      level2_profit = level2_profit/100 * 10;
      level3_profit = level3_profit/100 * 6;

      let new_rebade = level1_profit + level2_profit + level3_profit + node_prev_rebade;

      await User.findOne({inv : node_parent} ,{RebadeBonus : new_rebade},{new : true});

    }

    for(let i = 0; i<all_unsettled_bets.length(); i++){

      let prev_ammount = await User.findOne({inv : all_unsettled_bets[i]['inv']},{_id : 0 , ammount : 1});

      let new_ammount = prev_ammount['ammount'] + all_unsettled_bets[i]['ammount'] - 1;

      let doc =  await User.updateOne(
        {inv:all_unsettled_bets[i]['inv']},
        {$inc : {ammount : new_ammount}}
      );

      await Bet.findOneAndUpdate({inv : all_unsettled_bets[i]['inv'] } , {settled : true});

      settled.push(doc);
    }

    res.send(settled);

  }else{
    res.send("<h1>SOMETHING WENT WRONG</h1>");
  }

});

app.post('/spinner_update' , async(req, res)=>{

  if(!temp_user['number'] || !req.body.value){
    res.send({'status' : 0});
  }else{
    let amm = req.body.value.toFixed(3);
    await User.updateOne({phone : temp_user['number']} , {$inc : {Ammount : amm}});
    res.send({'status' : 1});
  }
  // let value =

})

app.post('/AdMiNgRoUp/league_1', async(req,res)=>{

  let settled = [];
  let bakra = [];

  let all_virtual_bets = await Bets.find({settled : false , league : 1 });

  if(all_virtual_bets){

    for(let i = 0 ; i< all_virtual_bets.length(); i++){

      let score_a = result[all_virtual_bets['leagueId']]['first'];
      let score_b = result[all_virtual_bets['leagueId']]['second'];

      if(
        all_virtual_bets[i]['scoreDetails']['first'] !== score_a ||
        all_virtual_bets[i]['scoreDetails']['second'] !== score_b
      ){

        let prev_ammount = await User.findOne({inv : all_virtual_bets[i]['inv']},{_id : 0 , ammount : 1});

        let betAmmount = parseFloat(all_virtual_bets[i]['bAmmount']);
        let profit = parseFloat(all_virtual_bets[i]['profit']);

        let new_ammount = parseFloat(prev_ammount['ammount']) +
                          betAmmount/100 * profit - 1;

        let doc = await User.findOneAndUpdate(
          {inv:all_virtual_bets[i]['inv']},
          {ammount : new_ammount , settled : true},{new : true}
        );
        settled.push(doc);
      }else{
        bakra.push({inv : all_virtual_bets[i]['inv'] , bet_ammount : all_virtual_bets[i]['bAmmount']})
      }
    }
    res.send({settled,bakra});
  }else{
    res.send("<h1>SOMETHING WENT WRONG</h1>");
  }
})

// user functions

async function newBet(data){

  let res = await Bet.create(data);
  let what_happened = (!res)? false : true;
  return what_happened;

}

async function newDeposit(data){

  let res = await Deposit.create(data);
  let what_happened = (!res)? false : true;
  return what_happened;
}

async function newWithdrawal(data){

  let res = await Withdrawal.create(data);
  let what_happened = (!res)? false : true;
  return what_happened;
}

async function createUser(data){

  let res = await User.create(data);
  temp_user['number'] = data['phone'];
  temp_user['inv'] = data['inv']
  temp_user['parent'] = data['parent'];
  // temp_user['last_spin'] = data['last_spin']
  return res;

};

// user functions ends

async function increment_parent_mem(inv , prev_members){
  let x = await User.updateOne({inv : inv} , {$inc : {members : 1}})
  return;
}

async function generate_inv_code(){

  let code_exist = false;
  let inv_code = parseInt(Math.floor(Math.random()*10000));

  let res = await User.findOne({inv : inv_code});

  // if found then code_exist = true;

  code_exist = (res)? true : false;

  if(inv_code < 1000 || code_exist){
    return generate_inv_code();
  }

  return inv_code;

}


async function connect_db() {

  await mongoose.connect(link)
  .then(function(db){
    console.log('dtabse connected');
    app.listen(port , ()=>{
      console.log(`listening on ${port}`);
    })

  })
  .catch(function(err){
    console.log(err);
  })

}
connect_db();
