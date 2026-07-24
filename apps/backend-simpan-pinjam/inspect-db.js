const { Pool } = require('pg');

const pool = new Pool({
    connectionString: 'postgresql://postgres:postgres@localhost:5432/simpan_pinjam',
});

(async () => {
    try {
        const client = await pool.connect();
        const nasabah = await client.query('SELECT count(*) AS nasabah_count FROM "Nasabah";');
        console.log('nasabah_count:', nasabah.rows[0].nasabah_count);
        const admins = await client.query('SELECT id, username, email, "isActive", password FROM "Admin" LIMIT 5;');
        console.log('Admin rows:', JSON.stringify(admins.rows, null, 2));
        client.release();
    } catch (err) {
        console.error(err);
        process.exit(1);
    } finally {
        await pool.end();
    }
})();
