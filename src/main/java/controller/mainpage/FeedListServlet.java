package controller.mainpage;

import java.io.IOException;
import java.util.List;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import biz.MainBIZ;
import dto.FeedListDTO;

@WebServlet(name = "FeedList", urlPatterns = { "/feedlist" })
public class FeedListServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		MainBIZ mainBiz = new MainBIZ();
		List<FeedListDTO> list = mainBiz.getFeedList();

		if (list != null) {
			System.out.println("success22");
			RequestDispatcher rd = request.getRequestDispatcher("/page/main_page.jsp");
			request.setAttribute("feed_list", list);
			rd.forward(request, response);
		}
	}
}
