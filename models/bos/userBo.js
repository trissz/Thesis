const bcrypt = require('bcrypt');
const UserDao = require('../daos/userDao');
const UserDo = require('../dos/userDo');
const UserDto = require('../dtos/userDto');
const LogHelper = require('../helpers/logHelper');
const UtilityHelper = require('../helpers/utilityHelper');
const ArrayHelper = require('../helpers/arrayHelper');

class UserBo
{
    constructor()
    {
        this.userDao = new UserDao();
    }

    async getHashFromPassword(userDo)
    {
        const saltRounds = 10;
    
        try {
            const hashedPassword = await bcrypt.hash(userDo.password, saltRounds);
            return hashedPassword;
        } catch ( error ) {
            LogHelper.addError('Error hashing password: ' + error.message);
            console.error('Error hashing password:', error.message);
            throw error;
        }
    }    

    isValidEmail(userDo)
    {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(userDo.email);
    }

    isValidPassword(userDo)
    {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!])[A-Za-z\d@#$%^&*!]{8,}$/;
        return passwordRegex.test(userDo.password);
    }

    baseValidateFields(userDo)
    {
        let isValid = true;

        const requiredFields = ArrayHelper.mergeUnique(UserDo.requiredFields, ['name', 'email', 'password', 'passwordAgain']);
        const missingFields = requiredFields.filter(field => !UtilityHelper.isset(userDo[field]));

        if ( missingFields.length > 0 )
        {
            missingFields.forEach(field =>
                LogHelper.addError(`Missing required field: ${field}`)
            );
            
            isValid = false;
        }

        for ( const field of requiredFields )
        {
            if ( !UtilityHelper.isset(userDo[field]) )
            {
                LogHelper.addError(`Invalid or undefined value for field "${field}": ${userDo[field]}`);
                isValid = false;
            }
        }

        return isValid;
    }

    async create(userDo)
    {
        let isCreateValid = true;

        isCreateValid = this.baseValidateFields(userDo);
        
        if ( !this.isValidEmail(userDo) )
        {
            LogHelper.addError('Invalid e-mail address: ' + userDo.email);
            //throw new Error('Invalid e-mail address');
            isCreateValid = false;
        }

        if ( UtilityHelper.isset(await this.userDao.getByEmail(userDo.email)) )
        {
            LogHelper.addError('The given e-mail address is already in use: ' + userDo.email);
            //throw new Error('The given e-mail address is already in use');
            isCreateValid = false;
        }

        /*if ( !this.isValidPassword(userDo) ) //TODO: Uncomment this in the future
        {
            LogHelper.addError('Invalid password: ' + userDo.password);
            //throw new Error('Invalid password. Requirements: minimum 8 character long, must contain minimum 1 lowercase letter and 1 uppercase letter, 1 numeric and 1 special character.');
            isCreateValid = false;
        }*/

        if ( userDo.password != userDo.passwordAgain )
        {
            LogHelper.addError('Passwords do not match');
            //throw new Error('Passwords do not match');
            isCreateValid = false;
        }
        
        userDo.passwordHash = await this.getHashFromPassword(userDo);
        return isCreateValid ? await this.userDao.create(userDo) : null;
    }

    async login(userDo)
    {
        let isLoginValid = true;

        if ( !UtilityHelper.isset(userDo.email) )
        {
            LogHelper.addError('Email is required');
            //throw new Error('Email is required');
            isLoginValid = false;
        }

        if ( !UtilityHelper.isset(userDo.password) )
        {
            LogHelper.addError('Password is required');
            //throw new Error('Password is required');
            isLoginValid = false;
        }

        const fetchedUserDo = await this.getByEmail(userDo.email);

        if ( !UtilityHelper.isset(fetchedUserDo) )
        {
            LogHelper.addError('User not found with email: ' + userDo.email);
            isLoginValid = false;
        }

        if ( !UtilityHelper.isset(fetchedUserDo) || !UtilityHelper.isset(fetchedUserDo.passwordHash) || !(await bcrypt.compare(userDo.password, fetchedUserDo.passwordHash)) )
        {
            LogHelper.addError('Invalid password');
            //throw new Error('Invalid password');
            isLoginValid = false;
        }

        return isLoginValid ? fetchedUserDo : null;
    }

    async getById(id)
    {
        return await this.userDao.getById(id);
    }

    async getByEmail(email)
    {
        return await this.userDao.getByEmail(email);
    }

    async getAll()
    {
        return await this.userDao.getAll();
    }

    async getPaginated(page, limit)
    {
        const offset = ( page - 1 ) * limit;
        return await this.userDao.getPaginated(limit, offset);
    }

    async getDetailedById(id)
    {
        return await this.userDao.getDetailedById(id);
    }

    async getDetailedAll()
    {
        return await this.userDao.getDetailedAll();
    }

    async getDetailedPaginated(page, limit)
    {
        const offset = ( page - 1 ) * limit;
        return await this.userDao.getDetailedPaginated(limit, offset);
    }

    async getCount()
    {
        return await this.userDao.getCount();
    }

    async deleteById(id)
    {
        return await this.userDao.deleteById(id);
    }

    async updateLastLoginById(id)
    {
        return await this.userDao.updateLastLoginById(id);
    }

    async update(userDo)
    {
        let isUpdateValid = true;

        if ( !UtilityHelper.isset(userDo.id) )
        {
            LogHelper.addError('User ID is required for update');
            isUpdateValid = false;
        }

        if ( !UtilityHelper.isset(userDo.name) )
        {
            LogHelper.addError('Invalid name for update: ' + userDo.name);
            isUpdateValid = false;
        }

        if ( !this.isValidPassword(userDo) )
        {
            LogHelper.addError('Invalid password for update: ' + userDo.password);
            const userDoFromDatabase = await this.getById(userDo.id);
            userDo.passwordHash = await userDoFromDatabase.passwordHash;
        }
        else
        {
            userDo.passwordHash = await this.getHashFromPassword(userDo);
        }

        return isUpdateValid ? await this.userDao.update(userDo) : null;
    }
}

module.exports = UserBo;