<?

class api_rssfeed
{


    // args: { title, content, created, modified, size}
    function create(&$args)
    {
        if (!isset($args["created"])) {
            $args["created"] = time();
        }
        if (!isset($args["modified"])) {
            $args["modified"] = $args["created"];
        }
        if (!isset($args["tags"])) {
            $args["tags"] = "";
        }
        $sql = "
                INSERT INTO
                    texts
                    (title, content, tags, created, modified, size)
                VALUES
                    (
                     %title%, 
                     %content%,
                     %tags%,
                     %created%,
                     %modified%,
                     %size%)";
        $args["size"] = strlen($args["content"]);
        if (!isset($args["title"])) {
            $args["title"] = "";
        }
        $this->db->query($sql, $args);
        return $this->db->insert_id();
    }


    // args: {id,  title, content, modified}
    function update(&$args)
    {
        $sql = "
                UPDATE
                    texts
                SET ";
        if (isset($args["title"])) {
            $sql .= "title = %title%, ";
        }
        if (isset($args["content"])) {
            $args["size"] = strlen($args["content"]);
            $sql .= "content = %content%, size = %size%, ";
        }
        if (!isset($args["modified"])) {
            $args["modified"] = time();
        }
        if (isset($args["tags"])) {
            $sql .= "tags = %tags%,";
        }
        if (isset($args["newsletter_exclude"])) {
            $sql .= "newsletter_exclude = %newsletter_exclude%,";
        }
        $sql .= "
                    modified = %modified%
                WHERE
                    id = %id%";

        $this->db->query($sql, $args);
        return $args["id"];
    }


    function &get($args)
    {
        if (is_array($args) && array_key_exists("tags", $args)) {
            $tags = explode(",", $args["tags"]);
            foreach ($tags as $key => $tag) {
                $tags[$key] = '"' . trim($tag) . '"';
            };
            $args["tags"] = implode(" ", $tags);

            $sql = "SELECT id FROM texts WHERE MATCH (tags) AGAINST (%tags% IN BOOLEAN MODE)";
            $res = $this->db->get_list($sql, $args);
            return $res;
        }
        if (!is_array($args["id"])) {
            $sql = "
                    SELECT 
                        *
                    FROM
                        texts
                    WHERE
                        id = %id%";
            return $this->db->get_first($sql, $args);
        } else {
            $sql = "
                    SELECT 
                        *
                    FROM
                        texts
                    WHERE
                        id IN(" . implode(",", $args["id"]) . ")";
            return $this->db->get_list($sql, $args);
        }
    }


    // args: {  [text] }
    function search(&$args)
    {
        $sql = "
                SELECT
                    id,
                    title,
                    size,
                    created,
                    modified,
                    tags,
                    newsletter_exclude
                FROM
                    texts";
        if (isset($args["text"]) && $args["text"] != "") {
            $sql .= " AND (title like %text% OR content like %text% OR tags like %text%)";
            $args["text"] = "%" . $args["text"] . "%";
        }
        $sql .= " ORDER BY title ";
        return $this->db->get_list($sql, $args);
    }


    function getIdsList()
    {
        $sql = "
                SELECT
                    id
                FROM
                    texts";
        return $this->db->get_vector($sql);
    }


    function delete(&$args)
    {
        $sql = "
                DELETE FROM
                    texts
                WHERE
                    id = %id%d";
        $this->db->query($sql, $args);
    }


    function setPageTexts($page_id, $texts)
    {
        $sql = "
                INSERT INTO
                    texts2pages
                    (page_id, text_id, title)
                VALUES 
                    (%pid%, %tid%, %title%)";
        foreach ($texts as $tid => $title) {
            $this->db->query($sql, array("pid" => $page_id, "tid" => $tid, "title" => $title));
        }
    }


    function getPageTexts($page_id)
    {
        $sql = "
                SELECT 
                    tp.title,
                    t.id,
                    t.content,
                    t.modified,
                    t.tags
                FROM
                    texts2pages as tp
                LEFT JOIN
                    texts as t
                ON
                    t.id = tp.text_id
                WHERE
                    tp.page_id = %pid%
                ORDER BY tp.id";
        return $this->db->get_list($sql, $page_id);
    }


    function removePageTexts($page_id)
    {
        $sql = "
                DELETE FROM
                    texts2pages
                WHERE
                    page_id = %pid%";
        $this->db->query($sql, $page_id);
    }


    // newsletter texts

    function getByPeriod($time_start, $time_end, $tags = "")
    {
        $p = array(
            "dstart" => $time_start,
            "dend" => $time_end
        );

        if ($tags != "") {
            $tags = str_replace(",", " ", $tags);
            $tags = explode(" ", $tags);

            $tags_where = array();
            for ($i = 0; $i < count($tags); $i++) {
                $t = trim($tags[$i]);
                if (strlen($t) > 2) {
                    $key = "tw" . $i;
                    $p[$key] = "%" . $t . "%";
                    $tags_where[] = "tags LIKE %" . $key . "%";
                }
            }
            $tags_where = " AND (" . implode(" OR ", $tags_where) . ")";
        } else {
            $tags_where = "";
        }

        $sql = "
                SELECT
                    id,
                    title, 
                    content
                FROM
                    texts
                WHERE
                    newsletter_exclude = 0 AND
                    newsletter_sent = 0 AND
                    (created > %dstart% AND created < %dend%)
                    " . $tags_where;
        return $this->db->get_list($sql, $p);
    }


    function markAsSent($ids = array())
    {
        $sql = "
                UPDATE
                    texts
                SET
                    newsletter_sent = 1
                WHERE
                    id IN (" . implode(",", $ids) . ")";
        $this->db->query($sql);
    }


}

?>