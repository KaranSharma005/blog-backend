const { boolean } = require("joi");
const mongoose = require("mongoose");

const testSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  duration : {
    type : Number,
    required: true
  },
  questions: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
  },
  title : {
    type : String,
    required : true,
  },
  active : {
    type : Boolean,
    default : false
  },
  delete : {
    type : Boolean,
    default : false,
  }
});

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Option" }],
    validate: {
      validator: function (val) {
        return val.length == 4;
      },
      message: "A question must contain between 4 options",
    },
  },
  correctAnswer : {
    type : String,
    required : true,
  }
});

const optionSchema = new mongoose.Schema({
    option : {
        type : String,
    }
})


const Option = mongoose.model("Option", optionSchema);
const Question = mongoose.model("Question", questionSchema);
const Test = mongoose.model("Test", testSchema);

module.exports = {
  Option,
  Question,
  Test
};