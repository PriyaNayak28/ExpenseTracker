const uuid = require('uuid');
const Sib = require('sib-api-v3-sdk');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const Forgotpassword = require('../models/forgot-password');

async function sendResetPasswordEmail(id) {
    const Client = Sib.ApiClient.instance;
    var apiKey = Client.authentications["api-key"];
    console.log(process.env.API_KEY);
    apiKey.apiKey = process.env.API_KEY;
    const sender = {
        email: "nayakpriya612@gmail.com",
    };

    const receivers = [
        {
            email: "pn6811754@gmail.com",
        },
    ];

    const transEmailApi = new Sib.TransactionalEmailsApi();

    const msg = {
        sender,
        to: receivers,
        subject: "Reset Password",
        text: "Reset your password",
        htmlContent: `<a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>`,
    };

    return transEmailApi
        .sendTransacEmail(msg)
        .then((resp) => {
            console.log("Email sent successfully:", resp);
            return resp;
        })
        .catch((err) => {
            console.log("Email sending failed:", err);
            return err;
        });
};

const forgotpassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });
        if (user) {
            const id = uuid.v4();
            user.createForgotpassword({ id, active: true })
                .catch(err => {
                    throw new Error(err)
                })
            await sendResetPasswordEmail(id);
            res.status(201)

        } else {
            throw new Error('User doesnt exist')
        }
    } catch (err) {
        console.error(err)
        return res.json({ message: err, sucess: false });
    }

}

const resetpassword = (req, res) => {
    const id = req.params.id;
    Forgotpassword.findOne({ where: { id } }).then(forgotpasswordrequest => {
        if (forgotpasswordrequest) {
            forgotpasswordrequest.update({ active: false });
            res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>

                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`
            )
            res.end()

        }
    })
}

const updatepassword = (req, res) => {

    try {
        const { newpassword } = req.query;
        const { resetpasswordid } = req.params;
        Forgotpassword.findOne({ where: { id: resetpasswordid } }).then(resetpasswordrequest => {
            User.findOne({ where: { id: resetpasswordrequest.userId } }).then(user => {
                // console.log('userDetails', user)
                if (user) {
                    //encrypt the password

                    const saltRounds = 10;
                    bcrypt.genSalt(saltRounds, function (err, salt) {
                        if (err) {
                            console.log(err);
                            throw new Error(err);
                        }
                        bcrypt.hash(newpassword, salt, function (err, hash) {
                            // Store hash in your password DB.
                            if (err) {
                                console.log(err);
                                throw new Error(err);
                            }
                            user.update({ password: hash }).then(() => {
                                res.status(201).json({ message: 'Successfuly update the new password' })
                            })
                        });
                    });
                } else {
                    return res.status(404).json({ error: 'No user Exists', success: false })
                }
            })
        })
    } catch (error) {
        return res.status(403).json({ error, success: false })
    }

}


module.exports = {
    forgotpassword,
    updatepassword,
    resetpassword
}