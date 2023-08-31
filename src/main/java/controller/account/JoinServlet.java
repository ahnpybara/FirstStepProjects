package controller.account;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import biz.AccountBIZ;
import dto.AccountDTO;

@WebServlet(name = "Join", urlPatterns = { "/join" })
public class JoinServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	
	// 회원가입 요청시 처리할 코드
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		request.setCharacterEncoding("utf-8");

		String email = request.getParameter("email");
		String name = request.getParameter("name");
		String nickname = request.getParameter("nickname");
		String password = request.getParameter("password");

		// 이메일 유효성 검사
		boolean isEmailValid = email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");

		// 비밀번호 유효성 검사
		boolean isPasswordValid = password.matches("^(?=.*[A-Za-z])(?=.*\\d).{6,}$");

		// 이름,닉네임 유효성 검사
		boolean isNameValid = name.matches("^[^\\s]+$");

		if (!isEmailValid) {
			// 유효하지 않은 이메일 처리
			response.sendRedirect("/maums/page/account/join.jsp?access_error=error");
			return;
		}

		if (!isPasswordValid) {
			// 유효하지 않은 비밀번호 처리
			response.sendRedirect("/maums/page/account/join.jsp?access_error=error");
			return;
		}

		if (!isNameValid) {
			// 유효하지 않은 이름 처리
			response.sendRedirect("/maums/page/account/join.jsp?access_error=error");
			return;
		}

		// 회원가입 중복 체크 로직
		AccountBIZ accountBiz = new AccountBIZ();
		AccountDTO accountDto = new AccountDTO(email, name, nickname, password);
		String isPossible = accountBiz.accountCheck(accountDto);
		
		if (isPossible.equals("non_duplicate")) {
			// 회원가입 로직
			boolean success = accountBiz.accountRegister(accountDto);

			if (success) {
				System.out.println("성공");
				response.sendRedirect("/maums/page/account/login.jsp");
			} else {
				System.out.println("실패");
				response.sendRedirect("/maums/page/account/join.jsp");
			}
			
		// 회원가입 중복 검사 로직
		} else if (isPossible.equals("email")) {
			System.out.println("이메일 중복!!");
			response.sendRedirect("/maums/page/account/join.jsp?duplicate_error=email");
		} else if (isPossible.equals("nickname")) {
			System.out.println("닉네임 중복!!");
			response.sendRedirect("/maums/page/account/join.jsp?duplicate_error=nickname");
		}
	}
}
