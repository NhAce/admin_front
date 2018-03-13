import Mock from 'mockjs';
const LoginUsers = [
  {
    id: 1,
    username: 'admin',
    password: '123456',
    avatar: 'https://raw.githubusercontent.com/taylorchen709/markdown-images/master/vueadmin/user.png',
    name: '张某某'
  }
];

const Users = [];

// for (let i = 0; i < 86; i++) {
//   Users.push(Mock.mock({
//     id: Mock.Random.guid(),
//     name: Mock.Random.cname(),
//     addr: Mock.mock('@county(true)'),
//     'age|18-60': 1,
//     birth: Mock.Random.date(),
//     sex: Mock.Random.integer(0, 1)
//   }));
// }

for (let i = 0; i < 86; i++) {
  Users.push(Mock.mock({
    id: Mock.Random.guid(),
    name: Mock.Random.cname(),
    'age|18-60': 1,
    time: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
    'isDownload|1': true,
    creditScore: Mock.Random.integer(500, 800),
    idCard: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/,
    mobile: /^(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/
  }));
}

export { LoginUsers, Users };
