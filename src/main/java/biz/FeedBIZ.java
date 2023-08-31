package biz;

import dao.FeedDAO;
import dto.FeedDTO;

public class FeedBIZ {
	// 피드 업로드 관련 메서드
	public boolean feedUploaded(FeedDTO feedDto) {
		FeedDAO feedDao = new FeedDAO();
		boolean isUpload = feedDao.feedUploaded(feedDto);
		return isUpload;
	}
}
