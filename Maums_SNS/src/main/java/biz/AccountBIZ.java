package biz;

import dao.AccountDAO;
import dto.AccountDTO;

public class AccountBIZ {
	
	// 로그인 관련 메서드
	public AccountDTO accountLogin(String email, String password) {
		AccountDAO accountDao = new AccountDAO();
		AccountDTO sessionUser = accountDao.accountLogin(email, password);
		return sessionUser;
	}
	
	// 회원가입 관련 메서드
	public boolean accountRegister(AccountDTO accountDto) {
		AccountDAO accountDao = new AccountDAO();
		boolean success = accountDao.accountRegister(accountDto);
		return success;
	}
	
	// 회원가입시 중복체크
	public String accountCheck(AccountDTO accountDto) {
		AccountDAO accountDao = new AccountDAO();
		String isPossible = accountDao.accountCheck(accountDto);
		return isPossible;
	}
}
