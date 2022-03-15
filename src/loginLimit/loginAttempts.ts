import {Response } from "express";

import { NextFunction } from "express";



const MAX_ATTEMPTS: number = 3;
const LOCK_DURATION: number = 60;

export const lock ={
  attempts:0,
  isLocked:false,
  unlocksAt:null,
}

export const locks={}

export const checkAttempts = (email) => {
  if (
    locks[email] &&
    locks[email].isLocked &&
    locks[email].unlocksAt > new Date()
  ) {
    return (locks[email].attempts);
  }
  return (locks[email].attempts);
};

export const invalidAttempt = (email) => {
  locks[email]=lock;
  locks[email].attempts += 1;
  if (locks[email].attempts > MAX_ATTEMPTS) {
    const d: Date = new Date();
    d.setSeconds(d.getSeconds() + LOCK_DURATION);
    locks[email].isLocked = true;
    locks[email].unlocksAt = d;
  }
};

export const deleteLocks = (email) => {
  if (locks[email]) {
    delete locks[email];
  }
};
