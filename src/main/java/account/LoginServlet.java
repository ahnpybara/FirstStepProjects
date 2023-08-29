package account;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import biz.AccountBIZ;
import dto.AccountDTO;

@WebServlet(name = "Login", urlPatterns = { "/login" })
public class LoginServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;


	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		
		String email = request.getParameter("email");
		String password = request.getParameter("password");
		
		AccountBIZ accountBiz = new AccountBIZ();
		Boolean success = accountBiz.accountLogin(email, password);
		AccountDTO accountDto = new AccountDTO(email, password);
		
		if(success) {
			HttpSession session = request.getSession();
			session.setAttribute(accountDto.getEmail(), accountDto); //세션 객체에 세션키와 값을 저장, 키이므로 대소문자 구분합니다.
			response.sendRedirect("/maums/page/main_page.jsp"); //실행 결과에 따라 사용자를 다른 페이지로 이동
			System.out.println("login OK");
		} else {
			response.sendRedirect("/maums/page/account/login.jsp"); //실행 결과에 따라 사용자를 다른 페이지로 이동
			System.out.println("login fail");
		}
	}
}
