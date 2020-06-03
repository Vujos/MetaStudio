package app.controllers;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import app.models.Board;
import app.services.BoardService;

@CrossOrigin(origins = { "http://localhost:4200" })
@RestController
@RequestMapping("/api/boards")
public class BoardController {

    @Autowired
    UserController userController;

    @Autowired
    BoardService boardService;

    @RequestMapping()
    public ResponseEntity<Iterable<Board>> getBoards() {
        return new ResponseEntity<Iterable<Board>>(boardService.getBoards(), HttpStatus.OK);
    }

    @RequestMapping(value = "/common/{id}/{email}", method = RequestMethod.GET)
    public ResponseEntity<Iterable<Board>> getCommonBoards(@PathVariable String id, @PathVariable String email) {
        return new ResponseEntity<Iterable<Board>>(boardService.getCommonBoards(id, email), HttpStatus.OK);
    }

    @RequestMapping(value = "/{id}/{email}", method = RequestMethod.GET)
    public ResponseEntity<Board> getBoardById(@PathVariable String id, @PathVariable String email) {
        Optional<Board> board = boardService.getBoardById(id, email);
        if (board.isPresent()) {
            return new ResponseEntity<Board>(board.get(), HttpStatus.OK);
        }
        return new ResponseEntity<Board>(HttpStatus.NOT_FOUND);
    }

    @RequestMapping(value = "/add", method = RequestMethod.POST)
    public ResponseEntity<Board> addBoard(@RequestBody Board board) {
        return new ResponseEntity<Board>(board, boardService.addBoard(board));
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    public ResponseEntity<HttpStatus> updateBoard(@PathVariable String id, @RequestBody Board board) {
        return boardService.updateBoardWebSocket(id, board);
    }

    @MessageMapping("/boards/update/{id}")
    public ResponseEntity<HttpStatus> updateBoardWebSocket(@DestinationVariable String id) throws Exception {
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<Board> removeBoard(@PathVariable String id) {
        try {
            boardService.removeBoard(id);

        } catch (Exception e) {
            return new ResponseEntity<Board>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<Board>(HttpStatus.NO_CONTENT);
    }

}
