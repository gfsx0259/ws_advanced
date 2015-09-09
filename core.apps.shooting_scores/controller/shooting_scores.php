<?php

class dialog_controller_shooting_scores extends dialog_controller
{

    var $fields = array(
        "date",
        "name",
        "target_1",
        "target_2",
        "target_3",
        "target_total",
        "group_1",
        "group_2",
        "group_3",
        "group_average",
        "action",
        "barrel",
        "powder",
        "gunsmith",
        "caliber",
        "primer",
        "bullets",
        "scope",
        "stock",
        "blind",
        "picture_1",
        "picture_2",
        "picture_3"
    );


    function run()
    {
        parent::run();
        switch ($_REQUEST["act"]) {
            case "get_data_keys_list":
                return $this->getDataKeysList();
                break;

            case "get_rows":
                return $this->getRows();
                break;
        }
    }


    function getDataKeysList()
    {
        $sql = "
                SELECT DISTINCT
                    data_key
                FROM
                    ext_shooting_scores";
        return array(
            "status" => "ok",
            "data" => $this->db->get_vector($sql)
        );
    }


    function getRows()
    {
        $sql = "
                SELECT
                    " . implode(",", $this->fields) . "
                FROM
                    ext_shooting_scores
                WHERE
                    data_key = %data_key%";

        $p = array(
            "data_key" => $_REQUEST["data_key"]
        );

        $res = $this->db->get_list($sql, $p);
        $rows = array();
        foreach ($res as $r) {
            $rows[] = array_values($r);
        }

        return array(
            "status" => "ok",
            "data" => $rows
        );
    }
}