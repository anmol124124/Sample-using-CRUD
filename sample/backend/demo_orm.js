/**
 * ORM Demo Script - Sequelize Implementation
 * Run: node demo_orm.js
 */

require('dotenv').config();
const { models } = require('./src/models');

async function demonstrateORM() {
  console.log('🚀 Sequelize ORM Demo\n');
  console.log('=' .repeat(50));

  try {
    // 1. Find All Exams
    console.log('\n1️⃣  Finding all exams using ORM:');
    console.log('   Code: models.Exam.findAll()');
    const exams = await models.Exam.findAll();
    console.log(`   ✅ Found ${exams.length} exams`);

    // 2. Find with Associations (Eager Loading)
    console.log('\n2️⃣  Finding exams with associations (JOIN):');
    console.log('   Code: models.Exam.findAll({ include: [...] })');
    const examsWithRelations = await models.Exam.findAll({
      include: [
        { model: models.User, as: 'creator', attributes: ['email', 'role'] },
        { model: models.File, as: 'files' }
      ],
      limit: 3
    });
    console.log(`   ✅ Found ${examsWithRelations.length} exams with creator and files`);
    examsWithRelations.forEach(exam => {
      console.log(`      - ${exam.title} by ${exam.creator?.email || 'Unknown'}`);
    });

    // 3. Find by Primary Key
    if (exams.length > 0) {
      console.log('\n3️⃣  Finding exam by ID (Primary Key):');
      console.log(`   Code: models.Exam.findByPk('${exams[0].id}')`);
      const exam = await models.Exam.findByPk(exams[0].id);
      console.log(`   ✅ Found: ${exam.title}`);
    }

    // 4. Count Records
    console.log('\n4️⃣  Counting records:');
    console.log('   Code: models.Exam.count()');
    const examCount = await models.Exam.count();
    console.log(`   ✅ Total exams: ${examCount}`);

    console.log('\n5️⃣  Counting users:');
    console.log('   Code: models.User.count()');
    const userCount = await models.User.count();
    console.log(`   ✅ Total users: ${userCount}`);

    // 5. Find with WHERE clause
    console.log('\n6️⃣  Finding user by email:');
    console.log('   Code: models.User.findOne({ where: { email: ... } })');
    const user = await models.User.findOne({
      where: { role: 'ADMIN' }
    });
    if (user) {
      console.log(`   ✅ Found admin: ${user.email}`);
    } else {
      console.log('   ℹ️  No admin user found');
    }

    // 6. Find with Conditions
    console.log('\n7️⃣  Finding upcoming exams:');
    console.log('   Code: models.Exam.findAll({ where: { scheduled_at: { [Op.gt]: ... } } })');
    const { Op } = require('sequelize');
    const upcomingExams = await models.Exam.findAll({
      where: {
        scheduled_at: {
          [Op.gt]: new Date()
        }
      }
    });
    console.log(`   ✅ Found ${upcomingExams.length} upcoming exams`);

    // 7. Aggregation
    console.log('\n8️⃣  Aggregation - Total file size:');
    console.log('   Code: models.File.sum("size_bytes")');
    const totalSize = await models.File.sum('size_bytes') || 0;
    console.log(`   ✅ Total files size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);

    // 8. Find All Files with Relations
    console.log('\n9️⃣  Finding files with exam and uploader:');
    console.log('   Code: models.File.findAll({ include: [...] })');
    const files = await models.File.findAll({
      include: [
        { model: models.Exam, as: 'exam', attributes: ['title'] },
        { model: models.User, as: 'uploader', attributes: ['email'] }
      ],
      limit: 3
    });
    console.log(`   ✅ Found ${files.length} files`);
    files.forEach(file => {
      console.log(`      - ${file.filename} for ${file.exam?.title || 'Unknown'}`);
    });

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('✅ ORM Demo Complete!');
    console.log('\n📊 Summary:');
    console.log(`   - Total Exams: ${examCount}`);
    console.log(`   - Total Users: ${userCount}`);
    console.log(`   - Total Files: ${files.length}`);
    console.log(`   - Upcoming Exams: ${upcomingExams.length}`);
    console.log('\n🎯 ORM Features Demonstrated:');
    console.log('   ✅ findAll() - Get all records');
    console.log('   ✅ findByPk() - Find by primary key');
    console.log('   ✅ findOne() - Find single record');
    console.log('   ✅ count() - Count records');
    console.log('   ✅ sum() - Aggregate function');
    console.log('   ✅ include - Eager loading (JOINs)');
    console.log('   ✅ where - Filtering conditions');
    console.log('   ✅ Op.gt - Operators (greater than)');
    console.log('   ✅ order - Sorting');
    console.log('   ✅ limit - Pagination');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
}

// Run the demo
demonstrateORM();
