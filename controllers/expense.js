
const Expense = require('../models/expense');
const User = require('../models/user');
const seqeulize = require('../util/database');

const addExpense = async (req, res, next) => {
    const t = await seqeulize.transaction();
    try {
        if (!req.body.category) {
            throw new Error('Category is mandatory')
        }
        const expense = req.body.expense;
        const desc = req.body.desc;
        const category = req.body.category;

        if (!expense || !expense?.length) {
            return res.status(400).json({ success: false, message: 'Parameters missing' })
        }

        const data = await Expense.create({ expense: expense, desc: desc, category: category, userId: req.user.id }, { transaction: t })
        const totalExpense = Number(req.user.totalExpenses) + Number(expense)

        await User.update({
            totalExpenses: totalExpense
        }, {
            where: { id: req.user.id },
            transaction: t
        }
        )
        await t.commit();
        res.status(201).json({ newExpenseDetail: data });

    } catch (err) {
        await t.rollback();
        res.status(500).json({
            success: false, error: err
        })
    }
}


const getExpense = async (req, res, next) => {
    try {
        const pagesize = 2;
        const page = + req.params.page || 1;
        let totalItems = await Expense.count({
            where: { userId: req.user.id }
        });
        console.log("totakItems", totalItems);
        const expenses = await Expense.findAll({
            where: { userId: req.user.id },
            offset: (page - 1) * pagesize,
            limit: pagesize
        });
        res.status(200).json({
            allExpenses: expenses,
            currentPage: page,
            hasNextPage: pagesize * page < totalItems,
            nextPage: page + 1,
            hasPreviousPage: page > 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalItems / pagesize),

        });
    } catch (error) {
        console.log('Get expense is failing', JSON.stringify(error))
        res.status(500).json({ error: error })
    }
}

const deleteExpense = async (req, res) => {
    const t = await seqeulize.transaction();
    try {

        if (req.params.id == 'undefined' || req.params.id.length === 0) {
            console.log('ID is missing')
            return res.status(400).json({ success: false, err: 'ID is missing' })
        }
        const eId = req.params.id
        const expense = await Expense.findByPk(eId)
        const expenseamt = expense.expense;
        const noofrows = await Expense.destroy({ where: { id: eId, userId: req.user.id } }, { transaction: t })
        const totalExpense = Number(req.user.totalExpenses) - Number(expenseamt)


        await User.update({
            totalExpenses: totalExpense
        }, {
            where: { id: req.user.id },
            transaction: t
        }
        )
        await t.commit();

        if (noofrows === 0) {
            return res.status(404).json({ success: false, message: 'Expense doesnt belong to the user' })
        }
        res.status(200).json({ success: true, message: "Deleted Successfully" });
    } catch (err) {
        await t.rollback();
        console.log(err);
        res.status(500).json(err)
    }
}

module.exports = {
    addExpense,
    getExpense,
    deleteExpense
};