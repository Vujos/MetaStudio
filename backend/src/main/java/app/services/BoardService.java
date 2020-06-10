package app.services;

import java.util.Collection;
import java.util.Iterator;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import app.models.Activity;
import app.models.Board;
import app.models.Card;
import app.models.Checklist;
import app.models.ChildBoard;
import app.models.List;
import app.models.Team;
import app.models.User;
import app.repositories.BoardRepository;
import app.repositories.ChildBoardRepository;
import app.repositories.ParentBoardRepository;

@Service
public class BoardService {

    @Autowired
    MongoTemplate mongoTemplate;

    @Autowired
    private BoardRepository boardRepo;

    @Autowired
    private ParentBoardRepository parentBoardRepo;

    @Autowired
    private ChildBoardRepository childBoardRepo;

    @Autowired
    private ListService listService;

    @Autowired
    private ActivityService activityService;

    @Autowired
    private UserService userService;

    @Autowired
    private SimpMessagingTemplate template;

    public BoardService() {
    }

    public Iterable<Board> getBoards() {
        return boardRepo.findAll();
    }

    public Iterable<Board> getCommonBoards(String id, String email) {
        Iterable<Board> boards = this.userService.getAllBoards(email);
        Iterable<Board> boards_2 = this.userService.getAllBoardsByUserId(id);
        Set<String> ids = ((Collection<Board>) boards_2).stream().map(obj -> obj.getId()).collect(Collectors.toSet());
        java.util.List<Board> intersection = ((Collection<Board>) boards).stream()
                .filter(obj -> ids.contains(obj.getId())).collect(Collectors.toList());
        for (Board board : intersection) {
            for (List list : board.getLists()) {
                Iterator<Card> i = list.getCards().iterator();
                while (i.hasNext()) {
                    java.util.List<User> users = ((Collection<User>) i.next().getMembers()).stream()
                            .filter(obj -> id.equals(obj.getId())).collect(Collectors.toList());
                    if (users.size() == 0) {
                        i.remove();
                    }
                }
            }
            board.getLists().removeIf(obj -> obj.getCards().size() == 0);
        }
        return intersection;
    }

    public Optional<Board> getBoardByIdInternalServer(String id) {
        Optional<Board> board = boardRepo.findById(id);
        if (board.isPresent()) {
            board.get().getLists().removeIf(obj -> obj.getDeleted() == true);
            for (List list : board.get().getLists()) {
                list.getCards().removeIf(obj -> obj.getDeleted() == true);
                for (Card card : list.getCards()) {
                    card.getChecklists().removeIf(obj -> obj.getDeleted() == true);
                    card.getSkills().removeIf(obj -> obj.getDeleted() == true);
                    for (Checklist checklist : card.getChecklists()) {
                        checklist.getTasks().removeIf(obj -> obj.getDeleted() == true);
                    }
                }
            }
        }
        return board;
    }

    public Optional<Board> getBoardById(String id, String email) {
        Optional<Board> board = boardRepo.findByIdAndDeleted(id, false);
        if (board.isPresent()) {
            for (User user : board.get().getUsers()) {
                if (user.getEmail().equals(email)) {
                    board.get().getLists().removeIf(obj -> obj.getDeleted() == true);
                    for (List list : board.get().getLists()) {
                        list.getCards().removeIf(obj -> obj.getDeleted() == true);
                        for (Card card : list.getCards()) {
                            card.getChecklists().removeIf(obj -> obj.getDeleted() == true);
                            card.getSkills().removeIf(obj -> obj.getDeleted() == true);
                            for (Checklist checklist : card.getChecklists()) {
                                checklist.getTasks().removeIf(obj -> obj.getDeleted() == true);
                            }
                        }
                    }
                    return board;
                }
            }
            for (Team team : board.get().getTeams()) {
                for (User user : team.getMembers()) {
                    if (user.getEmail().equals(email)) {
                        board.get().getLists().removeIf(obj -> obj.getDeleted() == true);
                        for (List list : board.get().getLists()) {
                            list.getCards().removeIf(obj -> obj.getDeleted() == true);
                            for (Card card : list.getCards()) {
                                card.getChecklists().removeIf(obj -> obj.getDeleted() == true);
                                card.getSkills().removeIf(obj -> obj.getDeleted() == true);
                                for (Checklist checklist : card.getChecklists()) {
                                    checklist.getTasks().removeIf(obj -> obj.getDeleted() == true);
                                }
                            }
                        }
                        return board;
                    }
                }
            }
        }
        return Optional.empty();
    }

    public HttpStatus addBoard(Board board) {
        for (List list : board.getLists()) {
            listService.addList(list);
        }
        boardRepo.save(board);
        return HttpStatus.CREATED;
    }

    public void removeBoard(String id) {
        Optional<Board> board = boardRepo.findByIdAndDeleted(id, false);
        if (board.isPresent()) {
            for (User user : board.get().getUsers()) {
                Query query = Query.query(Criteria.where("$id").is(new ObjectId(board.get().getId())));
                Update update = new Update().pull("boards", query);
                mongoTemplate.updateMulti(Query.query(Criteria.where("_id").is(new ObjectId(user.getId()))), update,
                        "users");
            }
        }
    }

    public void updateBoard(String id, Board board) {
        Optional<Board> oldBoard = boardRepo.findByIdAndDeleted(id, false);
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
            for (Activity activity : board.getActivities()) {
                if (activity.getId() == null) {
                    activityService.addActivity(activity);
                }
            }
            if (board.getParentBoard() != null && board.getParentBoard().getId() == null) {
                parentBoardRepo.save(board.getParentBoard());
            }
            for (ChildBoard childBoard : board.getChildBoards()) {
                if (childBoard.getId() == null) {
                    childBoardRepo.save(childBoard);
                }
            }
            boardRepo.save(board);
        }
    }

    public ResponseEntity<HttpStatus> updateBoardWebSocket(String id, Board board) {
        if (board.getDeleted() == true) {
            removeBoard(id);
            for (User user : board.getUsers()) {
                template.convertAndSend("/topic/users/update/" + user.getEmail(),
                        new ResponseEntity<HttpStatus>(HttpStatus.NO_CONTENT));
            }
            updateBoard(id, board);
            template.convertAndSend("/topic/boards/update/" + id,
                    new ResponseEntity<HttpStatus>(HttpStatus.NO_CONTENT));
            return new ResponseEntity<HttpStatus>(HttpStatus.NO_CONTENT);
        }
        updateBoard(id, board);
        Optional<Board> updatedBoard = getBoardByIdInternalServer(id);
        if (updatedBoard.isPresent()) {
            return new ResponseEntity<HttpStatus>(HttpStatus.CREATED);
        }
        return new ResponseEntity<HttpStatus>(HttpStatus.NOT_FOUND);
    }

}
