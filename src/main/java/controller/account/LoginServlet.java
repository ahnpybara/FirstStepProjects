package controller.account;

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

	// 로그인 요청시 처리할 메서드
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		
		// 클라이언트로 부터 전달 받은 정보를 저장
		String email = request.getParameter("email");
		String password = request.getParameter("password");
		
		// 전달 받은 정보를 토대로 처리할 메서드를 호출
		AccountBIZ accountBiz = new AccountBIZ();
		AccountDTO sessionUser = accountBiz.accountLogin(email, password);
		// 로그인 성공 여부
		if(sessionUser != null) {
			// 연결된 세션을 가져와서 세션에 값을 세팅한 후 메인페이지로 이동
			HttpSession session = request.getSession();
			session.setAttribute("sessionUser", sessionUser); 
			response.sendRedirect("/maums/feedlist");
			System.out.println("login OK");
		} else {
			response.sendRedirect("/maums/page/account/login.jsp?login_fail_error=error");
			System.out.println("login fail");
		}
	}
}
