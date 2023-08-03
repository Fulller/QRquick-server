import mongoose from "mongoose";
import os from "os";
import process from "process";

const OVERLOAD_TIME: number = 5000;

// Count connection
function countConnect(): number {
  const numConnection: number = mongoose.connections.length;
  console.log(`Number of connections::${numConnection}`);
  return numConnection;
}
// Check over load
function checkOverload(): boolean {
  setInterval((): void => {
    const numConnection: number = mongoose.connections.length;
    const numCore: number = os.cpus().length;
    const memoryUsage: number = process.memoryUsage().rss;
    const maxConnection: number = numCore * 5;
    console.log(`Active connection::${numConnection}`);
    console.log(`Memory usage::${memoryUsage / 1024 / 1024} MB`);
    if (numConnection > maxConnection) {
      console.log("Connection over load detected!");
    }
  }, OVERLOAD_TIME);
  return true;
}

export { countConnect, checkOverload };
