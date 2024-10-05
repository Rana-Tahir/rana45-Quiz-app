#! /usr/bin/env node

import * as readline from 'readline';
import chalk from 'chalk';

interface Question {
 question: string;
 options: string[];
 correctAnswerIndex: number;
}

interface Quiz {
 questions: Question[];
 currentQuestionIndex: number;
 score: number;
}

function displayQuestion(quiz: Quiz): void {
 const currentQuestion = quiz.questions[quiz.currentQuestionIndex];
 console.log(currentQuestion.question);
 currentQuestion.options.forEach((option, index) => {
 console.log(`${index + 1}. ${option}`);
 });
}

function processAnswer(quiz: Quiz, userAnswer: number): void {
 const currentQuestion = quiz.questions[quiz.currentQuestionIndex];
 if (userAnswer === currentQuestion.correctAnswerIndex + 1) {
 console.log(chalk.green("Correct!"));
 quiz.score++;
 } else {
 console.log(chalk.red("Incorrect! The correct answer is: "));
 console.log(chalk.green.bold(`${currentQuestion.correctAnswerIndex + 1}. ${currentQuestion.options[currentQuestion.correctAnswerIndex]}`));
 }
 quiz.currentQuestionIndex++;
 if (quiz.currentQuestionIndex === quiz.questions.length) {
 displayResult(quiz);
 }
}

function displayResult(quiz: Quiz): void {
 console.log(chalk.green.bold(`Your score is ${quiz.score} out of ${quiz.questions.length}`));
}

async function startQuiz(quiz: Quiz): Promise<void> {
 const rl = readline.createInterface({
 input: process.stdin,
 output: process.stdout
 });

 while (quiz.currentQuestionIndex < quiz.questions.length) {
 displayQuestion(quiz);
 const userInput = await new Promise<string>(resolve => {
 rl.question(chalk.blue.bold("Enter a valid option (or '0' to exit): "), resolve);
 });

 const userAnswer = parseInt(userInput, 10);
 if (userInput.trim() === '0') {
 console.log(chalk.blue("Exiting the quiz..."));
 displayResult(quiz);
 rl.close();
 return;
 }
 if (isNaN(userAnswer) || userAnswer < 1 || userAnswer > quiz.questions[quiz.currentQuestionIndex].options.length) {
 console.log(chalk.red.bold("Invalid input. Please enter a valid option or '0' to exit."));
 continue;
 }
 processAnswer(quiz, userAnswer);
 if (quiz.currentQuestionIndex === quiz.questions.length) {
 break;
 }
 }

 rl.close();
}

// Example Usage
const quiz: Quiz = {
 questions: [
 {
 question: "Q1: What is TypeScript?",
 options: ["A programming language", "A database", "A web server", "A CSS framework"],
 correctAnswerIndex: 0 // Correct index set to 0
 },
 {
    question: "Q2: Who invented JavaScript?",
    options: ["Netscape", "Brendan Eich", "Batman", "Yukihiro Matsumoto"],
    correctAnswerIndex: 1 // Correct index set to 1
 },
 {
    question: "Q3: What is the capital of France?",
    options: ["Paris", "London", "Berlin", "Madrid"],
    correctAnswerIndex: 0 // Correct index set to 0
 }
 ],
 currentQuestionIndex: 0,
 score: 0
};

startQuiz(quiz);