const bcrypt = require('bcrypt');
const hash = '$2b$10$QK6CQ44dMFDPqmNQOdbSbexhhDWud6V20CAz5hXK6yiuKdb9arg/a';
const password = 'admin123';
(async () => {
    const match = await bcrypt.compare(password, hash);
    console.log('compare result:', match);
})();
