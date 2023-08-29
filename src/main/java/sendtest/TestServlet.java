package sendtest;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Paths;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

@WebServlet(name = "Upload", urlPatterns = { "/upload" })
@MultipartConfig
public class TestServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8"); // 문자 인코딩을 UTF-8로 설정

		Part filePart = null;
		filePart = request.getPart("feed_image"); // 이미지 데이터 받아오기
		String fileName = Paths.get(filePart.getSubmittedFileName()).getFileName().toString(); // 파일 이름 추출
		InputStream fileContent = filePart.getInputStream(); // 파일의 내용을 가져온다.

		String text = request.getParameter("feed_text"); // 텍스트 데이터 받아오기

		String hashtags = request.getParameter("feed_hashtag"); // 해시태그 데이터 받아오기

		System.out.println(fileName);
		System.out.println(text);
		System.out.println(hashtags);

		fileContent.close();
		filePart.delete(); // 임시파일 삭제
	}
}