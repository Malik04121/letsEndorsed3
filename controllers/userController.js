const bcrypt = require('bcrypt');

const crypto = require('crypto')
var jwt = require('jsonwebtoken');
const { UserModel } = require('../userModel/userModel');

 

// Generate RSA key pair
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
  },
});

  // Encrypt data using public key
function encrypt(data) {
    const buffer = Buffer.from(data, 'utf8');
    const encrypted = crypto.publicEncrypt(publicKey, buffer);
    return encrypted.toString('base64');

}

// Decrypt data using private key
function decrypt(encryptedData,key) {
  const buffer = Buffer.from(encryptedData,'base64');
  const decrypted = crypto.privateDecrypt(key, buffer);
  return decrypted.toString('utf8');
}

  function hashPassword(password) {
    return bcrypt.hashSync(password, 10);
  }
  function generateToken(user){
    const payload = {
      userId: user._id,
      email: user.email,
      mobile: user.mobile
    };
  
    // Generate the token with a secret key
    const token = jwt.sign(payload, "secretkey");
  
    return token;
  }
  

exports.signup=async(req,res)=>{
    const {email,mobile,fullName,password}=req.body
     
     // Encrypt PII
  const encryptedEmail = encrypt(email);
  const encryptedMobile = encrypt(mobile);
  const encryptedFullName = encrypt(fullName);

       // Hash password
  const hashedPassword = hashPassword(password);
    try{
        
            const userdata=new UserModel({
                email:encryptedEmail,
                mobile:encryptedMobile,
                fullName:encryptedFullName,
                password:hashedPassword,
                key:privateKey
            })
            await userdata.save()
            res.send({msg:"User Register Successfully"})
    }
    catch(err){
    res.status(500).json({ message: 'Internal server error' });

    }
}
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
     const user=await UserModel.find()

    // Decrypt the stored email addresses before comparing
    const decryptedStoredEmails = user.map(storedEmail =>{
       return {email:decrypt(storedEmail.email,storedEmail.key),password:storedEmail.password}
    });
    let singleUser
    const found = decryptedStoredEmails.some((decryptedStoredEmail) => {
        if(decryptedStoredEmail.email === email){
            singleUser=decryptedStoredEmail
            return true
        }
    });
    if(found){
          //  Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password,singleUser.password);
      if (!isPasswordValid) {
          return res.status(401).json({ message: 'Invalid password' });
        }
         else{
          // Generate JWT token with user information
        const token = generateToken(singleUser);
        res.send({token})
      }
  }
  else{
    return res.status(401).json({ message: 'User is not Registered' });
  }
       
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.resetPassword=async(req,res)=>{
  const {id } = req.params;
    const {oldPassword,newPassword}=req.body
    try{
      const user=await UserModel.find({_id:id})
      console.log(user,"user is this")
      // Verify if the current password matches the stored hashed password
    const isPasswordValid = await bcrypt.compare(oldPassword, user[0].password);
      
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid old password' });
    }

    // Hash the new password
    const hashedPassword = hashPassword(newPassword);

    // Update the user's password in the database
    user[0].password = hashedPassword;
    await user[0].save();

    res.status(200).json({ message: 'Password changed successfully' });
    }
    catch(err){
        console.log(err)
    }
}
exports.updateUser=async(req,res)=>{
    const {id}=req.params
    const encryptedObject={}
    for(let field in req.body){
      
      const value = req.body[field];
      if(field!=="password"){
        const encryptedValue = encrypt(value);
        encryptedObject[field] = encryptedValue;
      }
      
    }
    try{
          
          await UserModel.findByIdAndUpdate(id, encryptedObject );
          res.send("updated user")
    }
    catch(err){
        console.log(err)
    }
}