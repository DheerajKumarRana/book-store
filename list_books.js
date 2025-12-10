const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://dheeraj_db_user:fys3cisAk59Ogkkp@cluster0.clwybkp.mongodb.net/bookstore?appName=Cluster0';

const BookSchema = new mongoose.Schema({
    title: String,
});

const Book = mongoose.models.Book || mongoose.model('Book', BookSchema);

async function listBooks() {
    try {
        await mongoose.connect(MONGODB_URI);
        const id = '692d8e81331ef9637841033d'; // ID from screenshot (approx)
        // actually let's just list all again but cleaner
        const books = await Book.find({});
        const fs = require('fs');
        let output = '--- BOOK COUNT: ' + books.length + ' ---\n';
        books.forEach(b => output += `ID: ${b._id.toString()} | Title: ${b.title}\n`);
        fs.writeFileSync('book_ids.txt', output);
        console.log('Written to book_ids.txt');
    } catch (error) {
        console.error(error);
    } finally {
        await mongoose.disconnect();
    }
}

listBooks();
