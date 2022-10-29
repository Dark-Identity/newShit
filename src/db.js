const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

let SchemaTypes = mongoose.Schema.Types;

const newUserSchema = new mongoose.Schema ({

    user : {
      type : String,
      required : true,
      unique : true
    },
    password : {
      type : String,
      required : true
    },
    inv : {
      type : Number,
      default : 0
    },
    members : {
      type  : Number,
      default : 0
    },
    BonusMemberCnt : {type : Number , default : 0},//after each rotation of 5 it will give the bonus and reset to 0;
    parent : {
      type : Number,
      default : 0
    },
    Ammount : {
      type : Number,
      default : 20
    },
    deposit : {type : Number , default : 0},
    BankDetails : [{
      Name : {type : String},
      AcNumber : {type : Number},
      Ifsc : {type : String},
    }],
    RebadeBonus : {type : Number , default : 0},
    WithdrawalDetails : [{
      withdrawalAmmount : {type : Number},
      Withdrawals : {type : Number},
    }],
    phone : {
      type : Number,
      required : true,
      unique : true
    },
    betPlayed : {
      type : Number,
      default : 0
    },
    profit : {
      type : Number,
      default : 0
    },
    withdrawalC : {
      type : Number,
      default : 0
    },
    day_withdrawal : {
      type : Number,
      default : 0
    },
    vipLevel :{
      type  : Number,
      default : 0
    }
});

const newBetSchema = new mongoose.Schema ({
  phone : {type : Number},
  team_a : {type : String},
  team_b : {type : String},
  bAmmount : {type : Number},
  leagueId : {type : Number},
  league : {type : String},
  inv : {type : Number},
  rebade_amm : {type : Number , default : 0},
  parent  :{typee : Number},
  ammount : {type : Number , default : 0},
  scoreDetails : [{
    first : {
      type : Number , default : -1},
    second : {
      type : Number , default : -1}
  }],
  final_score : [{
    first : {type : Number , default : -1},
    second : {type : Number , default : -1}
  }],
  date : {type : String},
  time : {type : String},
  profit : {type : Number , default : 0},
  settled : {type : Boolean , default : false},
  league_type : {type : Number }
});

const newDepositSchema = new mongoose.Schema({
  date : {type : Date},
  Ammount : {type : Number},
  user : {type : String},
  phone : {type : Number}
});
const newWithdrawalSchema = new mongoose.Schema({
  date : {type : Date},
  Ammount : {type : Number},
  user : {type : String},
  phone : {type : Number},
  status : {type : Number} // 0 -> pending, 1 -> success , 2 -> canceled
});

// create schemas for bets and payments

newUserSchema.methods.generateToken = async function(){

  try {

    const token =   jwt.sign({_id : this._id.toString() },'VISHAL');
    return token;

  } catch (e) {
    console.log(e);
  }
}


 const User =  mongoose.model("users" , newUserSchema );
 const Bet = mongoose.model('bets' , newBetSchema);
 const Deposit = mongoose.model('deposits' , newDepositSchema);
 const Withdrawal = mongoose.model('withdrawals' , newWithdrawalSchema);


module.exports = {User, Bet ,Deposit,Withdrawal};
