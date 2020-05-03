package app.project_manager.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import app.project_manager.models.Board;
import app.project_manager.models.List;
import app.project_manager.repositories.BoardRepository;

@Service
public class BoardService {

    @Autowired
    private BoardRepository boardRepo;

    @Autowired
    private ListService listService;

    public BoardService() {
    }

    public Iterable<Board> getBoards() {
        return boardRepo.findAll();
    }

    public Optional<Board> getBoardById(String id) {
        return boardRepo.findById(id);
    }

    public HttpStatus addBoard(Board board) {
        for (List list : board.getLists()) {
            listService.addList(list);
        }
        boardRepo.save(board);
        return HttpStatus.CREATED;
    }

    public void removeBoard(String id) {
        Optional<Board> board = boardRepo.findById(id);
        boardRepo.delete(board.get());
    }

    public void updateBoard(String id, Board board) {
        Optional<Board> oldBoard = boardRepo.findById(id);
        if (oldBoard.isPresent()) {
            board.setId(oldBoard.get().getId());
            for (List list : board.getLists()) {
                String listId = list.getId();
                Optional<List> oldList = listService.getListById(listId);
                if (oldList.isPresent()) {
                    listService.updateList(listId, list);
                }
                if (listId == null) {
                    listService.addList(list);
                }
            }
            boardRepo.save(board);
        }
    }

}
