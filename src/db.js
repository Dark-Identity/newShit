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
    BonusMemberCnt : {type : Number},//after each rotation of 5 it will give the bonus and reset to 0;
    parent : {
      type : Number,
      default : 0
    },
    Ammount : {
      type : Number,
      default : 20
    },
    BankDetails : [{
      Name : {type : String},
      AcNumber : {type : Number},
      Ifsc : {type : String},
    }],
    RebadeBonus : {type : Number},
    WithdrawalDetails : [{
      withdrawalAmmount : {type : Number},
      Withdrawals : {type : Number},
    }],
    phone : {
      type : Number,
      required : true,
      default : 0
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
    },
    tokens : [{
      token : {
        type : String,
        // required : true

      }
    }]
});
const newBetSchema = new mongoose.Schema ({
  phone : {type : Number},
  team_a : {type : String},
  team_b : {type : String},
  bAmmount : {type : Number},
  leagueId : {type : Number},
  league : {type : String},
  inv : {type : Number},
  parent  :{typee : Number},
  ammount : {type : Number},
  scoreDetails : [{
    first : {type : Number},
    second : {type : Number}
  }],
  final_score : [{
    first : {type : Number},
    second : {type : Number}
  }],
  date : {type : String},
  time : {type : String},
  profit : {type : Number},
  settled : {type : Boolean , default : false},

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

    const token =   jwt.sign({_id : this._id.toString() },'hey');

    this.tokens = this.tokens.concat({token});
    await this.save();
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
