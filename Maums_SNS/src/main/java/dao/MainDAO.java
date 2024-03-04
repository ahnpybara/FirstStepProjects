package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import dto.FeedListDTO;
import static common.JdbcTemplate.*;

public class MainDAO {

	// 피드리스트 반환을 위해 DB에 접근하는 로직
	public List<FeedListDTO> getFeedList() {
		List<FeedListDTO> list = new ArrayList<FeedListDTO>();
		FeedListDTO feedListDto = null;
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		Connection conn = getConnection();

		try {
			String sql = "SELECT f.feed_id, f.email, f.feed_image, f.feed_content, u.name, u.nickname FROM feeds f JOIN users u ON f.email = u.email";
			pstmt = conn.prepareStatement(sql);
			rs = pstmt.executeQuery();
			
			while(rs.next()) {
				feedListDto = new FeedListDTO();
				feedListDto.setFeed_id(rs.getInt("feed_id"));
				feedListDto.setEmail(rs.getString("email"));
				feedListDto.setFeed_image(rs.getString("feed_image"));
				feedListDto.setFeed_content(rs.getString("feed_content"));
				feedListDto.setName(rs.getString("name"));
				feedListDto.setNickname(rs.getString("nickname"));
				
				list.add(feedListDto);
			}
			
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			close(conn);
			close(rs);
			close(pstmt);
		}

		return list;
	}

}
