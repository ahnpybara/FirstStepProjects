package controller.upload;

import java.io.IOException;
import java.util.UUID;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.servlet.http.Part;

import biz.FeedBIZ;
import dto.AccountDTO;
import dto.FeedDTO;

@WebServlet(name = "FeedUpload", urlPatterns = { "/feedUpload" })
@MultipartConfig(fileSizeThreshold = 1024 * 1024 * 2, // 2MB
		maxFileSize = 1024 * 1024 * 10, // 10MB
		maxRequestSize = 102 * 1024 * 50) // 50MB
public class FeedUploadServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		try {
			// 멀티파트 요청에서 한 부분(이미지)만 가져옴
			Part filePart = request.getPart("feed_image");
			// 클라이언트가 업로드한 파일의 원본 이름을 가져옴
			String fileName = filePart.getSubmittedFileName();
			// 원본 파일의 확장자를 추출
			String extension = fileName.substring(fileName.lastIndexOf("."));
			// 웹 애플리케이션의 실제 경로를 구함
			String applicationPath = getServletContext().getRealPath("");
			// 이미지가 저장될 경로
			String basePath = applicationPath + "/images/";
			// UUID를 생성하여 고유한 새 파일 이름(uuidFileName)을 만들고 확장자를 붙여
			String uuidFileName = UUID.randomUUID().toString() + extension;
			// 지정된 경로에 저장
			filePart.write(basePath + uuidFileName);
			
			String content = request.getParameter("feed_text");
			
			HttpSession session = request.getSession();
	        AccountDTO user = (AccountDTO) session.getAttribute("sessionUser");
			System.out.println(user.getEmail());
			FeedDTO feedDto = new FeedDTO(user.getEmail(),uuidFileName,content);
			FeedBIZ feedBiz = new FeedBIZ();
			boolean success = feedBiz.feedUploaded(feedDto);
			
			if(success) {
				System.out.println("성공");
				response.sendRedirect("/maums/feedlist");
			}
			else {
				System.out.println("실패");
			}	
			
		} catch (Exception e) {
			throw new ServletException(e);
		}
	}
}