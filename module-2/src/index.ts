import express from 'express';
import uuid from 'uuid';

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const users: User[] = [];

app.post('/users', (req: express.Request, res: express.Response) => {
  const { login, password, age, isDeleted }: User = req.body;

  const newUser: User = {
    id: uuid(),
    login,
    password,
    age,
    isDeleted,
  };

  users.push(newUser);

  res.status(200);
  res.send(newUser);
});

app.put('/users/:id', (req: express.Request, res: express.Response) => {
  const { id } = req.params;
  const { login, password, age, isDeleted }: User = req.body;

  const indexOfUser = users.findIndex(user => user.id === id);

  if(indexOfUser >= 0) {
    const updatedUser = {
      id,
      login: login ? login : users[indexOfUser].login,
      password: password ? password : users[indexOfUser].password,
      age: age ? age : users[indexOfUser].age,
      isDeleted: isDeleted ? isDeleted : users[indexOfUser].isDeleted,
    }

    users[indexOfUser] = updatedUser;

    res.status(200);
    res.send(updatedUser);
  } else {
    res.status(404);
    res.send('Not found');
  }
});

app.get('/users/:id', (req: express.Request, res: express.Response) => {
  const { id } = req.params;

  const user = users.find(user => user.id === id);

  if(user) {
    res.status(200);
    res.send(user);
  } else {
    res.status(404);
    res.send('Not found');
  }
});

app.get('/users', (req: express.Request, res: express.Response) => {
  const { limit, loginSubstring } = req.query;

  const result = users
    .filter(user => user.login.includes(loginSubstring))
    .slice(0, limit);

  res.status(200);
  res.send(result);
});

app.delete('/users/:id', (req: express.Request, res: express.Response) => {
  const { id } = req.params;

  const indexOfUser = users.findIndex(user => user.id === id);

  console.log(indexOfUser)

  if(indexOfUser >= 0) {
    users[indexOfUser].isDeleted = true;

    res.sendStatus(204)
  } else {
    res.status(404);
    res.send('Not found');
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

interface User {
  id: string;
  login: string;
  password: string;
  age: number;
  isDeleted: boolean;
};
