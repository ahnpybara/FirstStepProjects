package biz;

import java.util.List;

import dao.MainDAO;
import dto.FeedListDTO;

public class MainBIZ {

	public List<FeedListDTO> getFeedList() {
		MainDAO mainDao = new MainDAO();
		List<FeedListDTO> list = mainDao.getFeedList();
		return list;
	}
}
