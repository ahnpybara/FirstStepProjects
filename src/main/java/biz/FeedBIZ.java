package biz;

import dao.FeedDAO;
import dto.FeedDTO;

public class FeedBIZ {

	public boolean feedUploaded(FeedDTO feedDto) {
		FeedDAO feedDao = new FeedDAO();
		boolean isUpload = feedDao.feedUploaded(feedDto);
		return isUpload;
	}

}
