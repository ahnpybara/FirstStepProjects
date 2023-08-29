package biz;

import dao.AccountDAO;
import dto.AccountDTO;

public class AccountBIZ {

	public boolean accountLogin(String email, String password) {
		AccountDAO accountDao = new AccountDAO();
		boolean islogin = accountDao.accountLogin(email, password);
		return islogin;
	}
	
	public boolean accountRegister(AccountDTO accountDto) {
		AccountDAO accountDao = new AccountDAO();
		boolean success = accountDao.accountRegister(accountDto);
		return success;
	}
}
