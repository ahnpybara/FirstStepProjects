package biz;

import dao.AccountDAO;
import dto.AccountDTO;

public class AccountBIZ {
	
	// 로그인 관련 메서드
	public boolean accountLogin(String email, String password) {
		AccountDAO accountDao = new AccountDAO();
		boolean isLogin = accountDao.accountLogin(email, password);
		return isLogin;
	}
	
	// 회원가입 관련 메서드
	public boolean accountRegister(AccountDTO accountDto) {
		AccountDAO accountDao = new AccountDAO();
		boolean success = accountDao.accountRegister(accountDto);
		return success;
	}
}
