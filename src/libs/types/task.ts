import { IUser } from "./user";

export interface ITask {
  id: number;
  name: string;
  description: string;
  status: string;
  type: string;
  start_date: string;
  working_time: number;
  price: number;
  payment_method: string;

  job_poster_id: number;
  job_seeker_id?: number;

  created_at: string;
  updated_at: string;

  job_poster: IUser;
  job_seeker?: IUser;
  order: IOrder[];
}

export interface IOrder {
  id: number;
  order_date: string;
  total_price: number;
  task_id: number;
  user_id: number;

  created_at: string;
  updated_at: string;

  task: ITask;
  user: IUser;
  payment?: IPayment;
}

export interface IPayment {
  id: number;
  payment_date: string;
  amount: number;
  order_id: number;

  created_at: string;
  updated_at: string;

  order?: IOrder;
}
