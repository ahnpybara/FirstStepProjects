package biz;

import java.util.List;

import dao.MainDAO;
import dto.FeedListDTO;

public class MainBIZ {
	// 메인화면에 보여질 피드 리스트 관련 메서드
	public List<FeedListDTO> getFeedList() {
		MainDAO mainDao = new MainDAO();
		List<FeedListDTO> list = mainDao.getFeedList();
		return list;
	}
}
