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


	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		request.setCharacterEncoding("utf-8");
		
		String email = request.getParameter("email");
		String name = request.getParameter("name");
		String nickname = request.getParameter("nickname");
		String password = request.getParameter("password");
		
		AccountDTO accountDto = new AccountDTO(email,name,nickname,password);
		AccountBIZ accountBiz = new AccountBIZ();
		boolean success = accountBiz.accountRegister(accountDto);
		
		if(success) {
			System.out.println("성공");
			response.sendRedirect("/maums/page/account/login.jsp");
		}
		else {
			System.out.println("실패");
			response.sendRedirect("/maums/page/account/join.jsp");
		}	
	}
}




