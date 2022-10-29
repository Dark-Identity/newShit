const express  = require('express');
const hbs = require('hbs');
const parser = require('cookie-parser');
const {User, Bet ,Deposit,Withdrawal} = require('./db');
const path = require('path');
const auth = require('./auth');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken' );
const cookieParser = require('cookie-parser');
const request = require("request");

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
  parent : 0,
  id : 0
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
  code = parseInt(req.params.id);
  console.log(code);
  res.writeHead(301, { "Location": '/invited' });
  res.end();
})


// get all the data

app.get('/user_data' , async (req , res)=>{

  let data ;

  if(!temp_user['number'] || !verify_user(req,res)){
    res.clearCookie('id');
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
        res.clearCookie('id');
      res.send({status : 0});

    } finally {

      if(verify_user(req,res)){
        res.send(data);
      }else{
          res.clearCookie('id');
        res.send({status : 0})
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

  let data = {};

  if(temp_user['inv'] && verify_user(req , res)){

    let direct_members = await User.find(
      {parent : temp_user['inv']},
      {_id : 0 , user : 1 , members : 1 , Ammount : 1 , WithdrawalDetails : 1  , betPlayed : 1 , withdrawalC : 1 , inv : 1 , deposit : 1}
    );
    let level2_user = {};
    let level3_user = {};

    data['direct_members'] = direct_members;

    for(let i = 0 ; i< direct_members.length; i++){
     let level2 =   await User.find(
        {parent : direct_members[i].inv},
        {_id : 0 , user : 1 , members : 1 , Ammount : 1 , WithdrawalDetails : 1  , betPlayed : 1 , withdrawalC : 1 , inv : 1, deposit : 1}
      );
      level2_user[i] = level2;
      for(let j = 0 ; j < level2.length; j++){
        let level3 =  await User.find(
           {parent : level2[j].inv},
           {_id : 0 , user : 1 , members : 1 , Ammount : 1 , WithdrawalDetails : 1  , betPlayed : 1 , withdrawalC : 1 , inv : 1, deposit : 1}
         );
         // level3_user.push(level3);
         level3_user[j] = level3;
      }

    }

    data['status'] = 1;
    data['level2_user'] = level2_user;
    data['level3_user'] = level3_user;
    // console.log(data);
    return res.send(data);

  }else{
      res.clearCookie('id');
    return res.send({status : 0});
  }

});

app.get('/get_bet_history' , async (req,res)=>{

  if(temp_user['number'] && await verify_user(req , res)){

    let setteled_bets = await Bet.find({phone : temp_user['number'] , settled : true} , {_id : 0 , team_a : 1 , team_b : 1 , scoreDetails : 1 , final_score : 1 , date : 1 , profit : 1 , time : 1 , league : 1  , bAmmount : 1, leagueId : 1});

    let unsetteled_bets = await Bet.find({phone : temp_user['number'] , settled : false} , {_id : 0 , team_a : 1 , team_b : 1 , scoreDetails : 1  , date : 1 , profit : 1 , time : 1 , league : 1 , bAmmount : 1 , leagueId : 1});

    let data = {setteled_bets,unsetteled_bets , status : 1};

    res.send(data);

  }else{
      res.clearCookie('id');
    res.send({status : 0});
  }

}); //done


app.post('/placebet' , async (req,res)=>{

  let date = Date.now();
  let bet_exist = await Bet.findOne(
    {
    phone : temp_user['number'],
    leagueId : req.body.league_id,
    team_a :  req.body.team_a ,
    team_b : req.body.team_b ,
    settled: false
  }
  );



  let time_left = await check_date( req.body.date , req.body.time );

  if(time_left && temp_user['number'] && !bet_exist && await verify_user(req , res)){

    let user_balance = await User.findOne({phone : temp_user['inv']} , {Ammount : 1});
    user_balance = parseFloat(user_balance);

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
      final_score : [
        {
          first : -1,
          second : -1
        }
      ],
      date : req.body.date,
      time : req.body.time,
      profit : req.body.profit,
      league_type : req.body.l_type
    }

    let bet_amount = -parseFloat(req.body.ammount);

    // if(user_balance >= req.body.ammount){
      if(await newBet(data)){
        // await User.findOneAndUpdate( {phone : temp_user['number']} , {$inc : {betPlayed : 1 , Ammount : bet_amount} });
        await User.findOneAndUpdate( {phone : temp_user['number']} , {$inc : {betPlayed : 1 } });

        res.send({'status' : 1});
      }else{
      res.clearCookie('id');
      res.send({'status' : 0});
    }
    // }else{
    //   return res.send({status : 4})
    // }

  }else{

    if(bet_exist){
      return res.send({status : 2});
    }else if(!time_left){
      return res.send({status : 3});
    }else{
      res.clearCookie('id');
      return res.send({status : 0});
    }
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
           res.clearCookie('id');
         res.send({status : 0});
       }

     }else{
       res.send({status : 2})
     }

   }else{
       res.clearCookie('id');
     res.send({status : 0})
   }

 }else{
     res.clearCookie('id');
   res.send({status : 0})
 }

})


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

  res.clearCookie('id');

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
          res.clearCookie('id');
        return res.send({status : 0})
      }

    }else{
        res.clearCookie('id');
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
  res.clearCookie('id');
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
      res.clearCookie('id');
    res.send({status : 0});
  }


})

async function get_settled_bet_byID(id){

  var options = {
  method: 'GET',
  url: `https://v3.football.api-sports.io/fixtures`,
  qs: {id : id},
  headers : {
      "x-rapidapi-host": "v3.football.api-sports.io",
      "x-rapidapi-key": "021ae6685ec46e47ec83f8848ac1d168"
      // "x-rapidapi-key": "823296afa77a4989062591abc46178ee"
    }

};

  return new Promise(function (resolve, reject) {
  request(options , function (error, res, body) {
    if (!error && res.statusCode === 200) {
      resolve(body);
     } else {
      reject(error);
     }
   });
 });

}

async function get_settled_bet_today(){

  let date = new Date();

  var options = {
  method: 'GET',
  url: `https://v3.football.api-sports.io/fixtures/?date=${date.getFullYear() - 5}-${date.getMonth() + 1}-${date.getDate()}`,
  qs: {status:'FT'},
  headers : {
      "x-rapidapi-host": "v3.football.api-sports.io",
      "x-rapidapi-key": "021ae6685ec46e47ec83f8848ac1d168"
      // "x-rapidapi-key": "823296afa77a4989062591abc46178ee"
    }

};

  return new Promise(function (resolve, reject) {
  request(options , function (error, res, body) {
    if (!error && res.statusCode === 200) {
      resolve(body);
     } else {
      reject(error);
     }
   });
 });

}

// live league

app.get('/AdMiNgRoUp/league_0' , (req,res)=>{
  res.render('bet_settle');
})

app.post('/AdMiNgRoUp/league_0' , async(req,res)=>{

  let id = req.body['id'];

  if(!id){
    return res.send('<h1>SORRY SOMETHING WENT WRONG WITH LEAGUE ID</h1>');
  }else{


  let results = {};
  let settled = [];
  let bets = {};

  // add another querry parameter league id , cause if one user places two bets then he will get double rebade ammount; and this id you will get from user;

  let all_unsettled_bets = await Bet.find({settled : false , league_type : 1 , leagueId : id} , {bAmmount : 1 , leagueId : 1 , inv : 1 , scoreDetails : 1 , profit : 1 , date : 1 , members : 1 , ammount : 1 , final_score : 1 , rebade_amm : 1});
   console.log(all_unsettled_bets);

if(all_unsettled_bets ){

  let data = await get_settled_bet_byID(parseInt(all_unsettled_bets[0]['leagueId']));
  data = await JSON.parse(data);

   if(data ){

     let result_id = parseInt(data['response'][0]['fixture']['id']);
     let result_obj = data['response'][0]['goals'];

     results[result_id] = result_obj;
   }else{
    return res.send(`<h1>Something went wrong try again. after checking the database or league id you entered !!!</h1>`);
   }

}else{
  return res.send(`<h1>Either their is no bet to settle or you have entered wrong league id`);
}

 // setting things up
 if(all_unsettled_bets ){

   for(let item of all_unsettled_bets){

   if( !(item['leagueId'] in results) ){
      res.send(`<h1>ODD ONE OUT PLEASE ${item['leagueId']}</h1>`);
   }else{

     //this bets object will help me fin wethere a user has placed bet or not in O(1);
     bets[item['inv']] = item;

   }

  }

 }


  let test_array = [];
  // analyze all the data
  if(all_unsettled_bets ){

    for(let level0 of all_unsettled_bets){

      let body = {
        inv : level0['inv'],
        leagueId : level0['leagueId'],
        amount : 0,
        profit : 0,
        rebade : 0,
        score_a : 0,
        score_b : 0,
     }

    let level1_rebade = 0 ;
    let level2_rebade = 0 ;
    let level3_rebade = 0 ;

    // console.log(level0);
    let score0 = results[level0['leagueId']];
    let test_amount = 0;
    let test_profit = 0;
    // console.log(results , level0['leagueId']);
    let score_a = parseInt(score0['home']);
    let score_b = parseInt(score0['away']);

    if(level0['scoreDetails'][0]['first'] !== score_a ||
       level0['scoreDetails'][0]['second'] !== score_b)
       {

          let profit0 = parseFloat(level0['profit']);
          let bet_ammount0 = parseFloat(level0['bAmmount']);

          body['amount'] = bet_ammount0 + (bet_ammount0/100 * profit0 - 1);

          body['profit'] = parseFloat(parseFloat(bet_ammount0/100 * profit0 - 1).toFixed(3));

       }

    body['score_a'] = score_a;
    body['score_b'] = score_b;

   // find level 1 users

    let level1_user = await User.find({parent : parseInt(level0['inv']) ,  betPlayed : {$gt: 0} });

    if(level1_user ){

      for(let level1 of level1_user){

        if(level1['inv'] in bets){

        if(bets[level1['inv']]['scoreDetails'][0]['first'] !== score_a ||
           bets[level1['inv']]['scoreDetails'][0]['second'] !== score_b)
           {

              let profit1 = parseFloat((bets[level1['inv']]['profit']).toFixed(3));
              let bet_ammount1 = parseFloat(parseFloat(bets[level1['inv']]['bAmmount']).toFixed(3));

              level1_rebade += parseFloat( (bet_ammount1/100 * profit1).toFixed(3) );

           }

       }

        let level2_user = await User.find({parent : parseInt(level1['inv']) , betPlayed : {$gt : 0} });

        if(level2_user ){

          for(let level2 of level2_user){

            if(level2['inv'] in bets){


              if(bets[level2['inv']]['scoreDetails'][0]['first'] !== score_a ||
                 bets[level2['inv']]['scoreDetails'][0]['second'] !== score_b)
                 {

                    let profit2 = parseFloat(bets[level2['inv']]['profit']);
                    let bet_ammount2 = parseFloat(bets[level2['inv']]['bAmmount']);

                    level2_rebade += (bet_ammount2/100) * profit2;

                 }


            }

            let level3_user = await User.find({parent : level2['inv'] , betPlayed : {$gt : 0} });

            if(level3_user = true){

              for(level3 of level3_user){

                if(level3['inv'] in bets){



                  if(bets[level3['inv']]['scoreDetails'][0]['first'] !== score_a ||
                     bets[level3['inv']]['scoreDetails'][0]['second'] !== score_b)
                     {

                        let profit3 = parseFloat(bets[level3['inv']]['profit']);
                        let bet_ammount3 = parseFloat(bets[level3['inv']]['bAmmount']);


                        level3_rebade += (bet_ammount3/100) * profit3;

                     }

                }

              }
            }

          }

        }

      }

    }


    let final_rebade1 = parseFloat( ((parseFloat(level1_rebade)/100 ) * 12).toFixed(3) );
    let final_rebade2 = parseFloat( ((parseFloat(level2_rebade)/100 ) * 10).toFixed(3) );
    let final_rebade3 = parseFloat( ((parseFloat(level3_rebade)/100 ) * 8).toFixed(3) );

    body['rebade'] = parseFloat( (final_rebade1 + final_rebade2 + final_rebade3).toFixed(3) );

      test_array.push(body);
  }

}


  let data_to_send = {};
  let went_wrong = [];

 if(test_array ){
   for(let update_it of test_array){

    let set_score_a = parseInt(update_it['score_a']);
    let set_score_b = parseInt(update_it['score_b']);
    let to_update_amm = parseFloat( (update_it['amount'] + update_it['rebade']).toFixed(3) );

    let updated_data = await User.findOneAndUpdate(
      {inv : update_it['inv']} ,
      {
        $inc : {
          Ammount : to_update_amm,
          RebadeBonus : parseFloat(parseFloat(update_it['rebade']).toFixed(3)),
          profit : parseFloat(parseFloat(update_it['profit']).toFixed(3))
        },
      },{new : true}
    );

    let updated_bet = await Bet.findOneAndUpdate(
      {inv : update_it['inv'] , leagueId : update_it['leagueId']} ,
      {
        settled : true,
        final_score : [{first : set_score_a , second : set_score_b}]
      },{new : true}
    );

      data_to_send[ updated_bet['leagueId'] ] =  {
                                 'INVITATION CODE' : updated_data['inv'],
                                 'NEW AMMOUNT' : updated_data['Ammount'],
                                 'PROFIT'     : update_it['profit'],
                                 'HE GOT'   : update_it['ammount'],
                                 'BET AMOUNT': update_it['bAmmount'],
                                 'REBADE'    : update_it['rebade_amm']
                                      }

  }
 }

  return res.send({'settled_bets' : data_to_send , 'went wrong' : went_wrong});

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

// virtual league
app.post('/AdMiNgRoUp/league_1', async(req,res)=>{

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
